#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="$SCRIPT_DIR/upload-history.log"

# Configuration - Edit these values for your setup
REMOTE_HOST="dh"  # SSH host alias (e.g., "dh")
REMOTE_USER="larmo"
REMOTE_PATH="/home/larmo/roadtripsandhikes.org"

# Project root directory - where your files are located
# Options:
# 1. Use parent directory of script: PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
# 2. Use absolute path: PROJECT_ROOT="/home/larmo/roadtripsandhikes.org"
# 3. Use current directory: PROJECT_ROOT="$(pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"  # Assumes script is in a subdirectory like "scripts/"

# Define which files/directories to include
# You can specify:
# - Specific files: "index.html" or "./index.html"
# - Directory contents: "css/*" or "js/*"
# - Patterns: "*.html" or "images/*.jpg"
INCLUDE_PATTERNS=(
    "./index.html"
    "css/*"
    "js/*"
)

# Colors for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to show a spinner while rsync is running
show_spinner() {
    local pid=$1
    local delay=0.1
    local spinstr='|/-\'

    while kill -0 $pid 2>/dev/null; do
        local temp=${spinstr#?}
        printf " [%c]  " "$spinstr"
        local spinstr=$temp${spinstr%"$temp"}
        sleep $delay
        printf "\b\b\b\b\b\b"
    done
    printf "    \b\b\b\b"
}

echo -e "${BLUE}=== File Upload Script ===${NC}\n"
echo -e "Project root: ${PROJECT_ROOT}\n"

# Change to project root directory
cd "$PROJECT_ROOT" || {
    echo -e "${RED}Error: Cannot access project root directory${NC}"
    exit 1
}

# Get list of files based on include patterns
files=()
for pattern in "${INCLUDE_PATTERNS[@]}"; do
    while IFS= read -r file; do
        if [ -f "$file" ] && [[ ! "$file" =~ -bak ]] && [[ ! "$file" =~ -old ]]; then
            files+=("$file")
        fi
    done < <(compgen -G "$pattern" 2>/dev/null || true)
done

# Remove duplicates and sort
if [ ${#files[@]} -gt 0 ]; then
    IFS=$'\n' files=($(sort -u <<<"${files[*]}"))
    unset IFS
fi

if [ ${#files[@]} -eq 0 ]; then
    echo -e "${RED}No files found matching the specified patterns${NC}"
    exit 1
fi

# Display files with numbers
echo "Available files:"
for i in "${!files[@]}"; do
    printf "%3d) %s\n" $((i+1)) "${files[$i]}"
done

echo ""
echo -e "${YELLOW}Enter file numbers to upload (space-separated, e.g., '1 3 5'):${NC}"
echo -e "${YELLOW}Or enter 'a' for all files, 'o' for one-off file, or 'q' to quit:${NC}"
read -r selection

# Handle quit
if [[ "$selection" == "q" ]]; then
    echo "Cancelled."
    exit 0
fi

# Build array of selected files
selected_files=()

if [[ "$selection" == "o" ]]; then
    # One-off file upload
    echo ""
    echo -e "${YELLOW}Enter the file path (e.g., images/photo.jpg):${NC}"
    read -r oneoff_file

    # Check if file exists
    if [ ! -f "$oneoff_file" ]; then
        echo -e "${RED}Error: File '$oneoff_file' not found${NC}"
        exit 1
    fi

    selected_files=("$oneoff_file")
elif [[ "$selection" == "a" ]]; then
    # Select all files
    selected_files=("${files[@]}")
else
    # Parse space-separated numbers
    for num in $selection; do
        # Validate number
        if ! [[ "$num" =~ ^[0-9]+$ ]]; then
            echo -e "${RED}Invalid input: '$num' is not a number${NC}"
            exit 1
        fi

        # Convert to array index (subtract 1)
        idx=$((num-1))

        # Check if index is valid
        if [ $idx -lt 0 ] || [ $idx -ge ${#files[@]} ]; then
            echo -e "${RED}Invalid selection: $num (valid range: 1-${#files[@]})${NC}"
            exit 1
        fi

        selected_files+=("${files[$idx]}")
    done
fi

# Function to update cachebuster in index.html
update_cachebuster() {
    local file=$1
    local git_hash=$2
    local index_file="index.html"
    
    # Determine the pattern to match based on file type
    if [[ "$file" == css/* ]]; then
        local filename=$(basename "$file")
        # Match: href="css/filename.css?ANYTHING"
        sed -i.bak "s|href=\"css/${filename}?[^\"]*\"|href=\"css/${filename}?${git_hash}\"|g" "$index_file"
    elif [[ "$file" == js/* ]]; then
        local filename=$(basename "$file")
        # Match: src="js/filename.js?ANYTHING"
        sed -i.bak "s|src=\"js/${filename}?[^\"]*\"|src=\"js/${filename}?${git_hash}\"|g" "$index_file"
    fi
    
    # Remove backup file
    rm -f "${index_file}.bak"
}

# Check if any CSS or JS files are selected and get git hash
needs_index_update=false
git_hash=""
css_js_files=()

for file in "${selected_files[@]}"; do
    if [[ "$file" == css/* ]] || [[ "$file" == js/* ]]; then
        needs_index_update=true
        css_js_files+=("$file")
    fi
done

# Get git hash if we need to update cachebusters
if [ "$needs_index_update" = true ]; then
    git_hash=$(git rev-parse --short HEAD 2>/dev/null)
    
    if [ -z "$git_hash" ]; then
        echo -e "${YELLOW}Warning: Not a git repository. Using timestamp instead.${NC}"
        git_hash=$(date '+%Y%m%d%H%M%S')
    fi
    
    echo ""
    echo -e "${BLUE}Detected CSS/JS files - will auto-update cachebusters in index.html${NC}"
    echo -e "${BLUE}Using version: ${git_hash}${NC}"
    
    # Update cachebusters for each CSS/JS file
    for file in "${css_js_files[@]}"; do
        echo -e "  Updating cachebuster for: $file"
        update_cachebuster "$file" "$git_hash"
    done
    
    # Add index.html to upload list if not already included
    if [[ ! " ${selected_files[@]} " =~ " ./index.html " ]] && [[ ! " ${selected_files[@]} " =~ " index.html " ]]; then
        echo -e "${GREEN}  + Adding index.html to upload list${NC}"
        selected_files+=("./index.html")
    fi
fi

# Confirm selection
echo ""
echo -e "${GREEN}Files selected for upload:${NC}"
for file in "${selected_files[@]}"; do
    echo "  - $file"
done

echo ""
echo -e "${YELLOW}Upload to: ${REMOTE_HOST}:${REMOTE_PATH}${NC}"
echo -n "Proceed? (Y/n): "
read -r confirm

if [[ "$confirm" =~ ^[Nn]$ ]]; then
    echo "Cancelled."
    exit 0
fi

# Upload files
echo ""
echo -e "${BLUE}Starting upload...${NC}"
success_count=0
fail_count=0

# Log session start
echo "" >> "$LOG_FILE"
echo "==================================================" >> "$LOG_FILE"
echo "Upload Session: $(date '+%Y-%m-%d %H:%M:%S')" >> "$LOG_FILE"
echo "Destination: ${REMOTE_HOST}:${REMOTE_PATH}" >> "$LOG_FILE"
echo "==================================================" >> "$LOG_FILE"

for file in "${selected_files[@]}"; do
    echo -n "Uploading $file... "

    # Run rsync in background and capture its PID
    rsync -R "$file" "${REMOTE_HOST}:${REMOTE_PATH}/" > /dev/null 2>&1 &
    rsync_pid=$!

    # Show spinner while rsync is running
    show_spinner $rsync_pid

    # Check if rsync succeeded
    wait $rsync_pid
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC}"
        echo "[SUCCESS] $file" >> "$LOG_FILE"
        ((success_count++))
    else
        echo -e "${RED}✗ FAILED${NC}"
        echo "[FAILED]  $file" >> "$LOG_FILE"
        ((fail_count++))
    fi
done

# Log summary
echo "Summary: $success_count successful, $fail_count failed" >> "$LOG_FILE"

# Summary
echo ""
echo -e "${BLUE}=== Upload Complete ===${NC}"
echo -e "${GREEN}Successful: $success_count${NC}"
if [ $fail_count -gt 0 ]; then
    echo -e "${RED}Failed: $fail_count${NC}"
fi
