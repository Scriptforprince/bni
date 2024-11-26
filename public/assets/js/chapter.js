let apiUrl = 'https://bni-data-backend.onrender.com/api/chapters';
let allChapters = [];
let filteredChapters = [];
let allMembers = []; // Store all members globally
let allRegions = [];  // Store all regions globally

// Function to show the loader
function showLoader() {
    document.getElementById('loader').style.display = 'flex';
}

// Function to hide the loader
function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}

// Fetch members data
const fetchMembers = async () => {
    try {
        const response = await fetch('https://bni-data-backend.onrender.com/api/members');
        if (!response.ok) {
            throw new Error('Error fetching members data');
        }

        allMembers = await response.json();
        console.log('Fetched members:', allMembers);
    } catch (error) {
        console.error('Error fetching members:', error);
    }
};

// Fetch regions data
const fetchRegions = async () => {
    try {
        const response = await fetch('https://bni-data-backend.onrender.com/api/regions');
        if (!response.ok) {
            throw new Error('Error fetching regions data');
        }

        allRegions = await response.json();
        console.log('Fetched regions:', allRegions);
    } catch (error) {
        console.error('Error fetching regions:', error);
    }
};

// Function to fetch chapters
async function fetchChapters() {
    showLoader();
    try {
        console.log(`Fetching data from: ${apiUrl}`);
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status}`);
        }

        allChapters = await response.json();
        console.log('Fetched chapters:', allChapters);

        filteredChapters = [...allChapters];
        await Promise.all([fetchMembers(), fetchRegions()]);
        displayChapters(filteredChapters);
    } catch (error) {
        console.error('Error fetching chapters:', error);
    } finally {
        hideLoader();
    }
}

// Function to get the total number of members for a chapter
const getMemberCountForChapter = (chapterId) => {
    return allMembers.filter(member => member.chapter_id === chapterId).length;
};

// Function to get the region name for a region_id
const getRegionNameById = (regionId) => {
    const region = allRegions.find(r => r.region_id === regionId);
    return region ? region.region_name : 'Unknown Region'; // Return the region name or a default message
};

// Function to display chapters in the table
function displayChapters(chapters) {
    const tableBody = document.querySelector('table tbody');
    tableBody.innerHTML = '';

    chapters.forEach((chapter, index) => {
        const membersCount = getMemberCountForChapter(chapter.chapter_id);
        const regionName = getRegionNameById(chapter.region_id);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><b>${chapter.chapter_name}</b></td>
            
            <td>${regionName}</td> 
            <td><b>${membersCount}</b></td> 
            <td>${chapter.chapter_meeting_day}</td>
            <td><b>${chapter.chapter_kitty_fees}</b></td>
            <td><b>${chapter.chapter_visitor_fees}</b></td>
        
            <td>
                <span class="badge bg-${chapter.chapter_status === 'running' ? 'success' : 'danger'}">
                    ${chapter.chapter_status}
                </span>
            </td>
                     <td>
        <span class="badge bg-warning text-light" style="cursor:pointer; color:white;">
           <a href="/c/edit-chapter/?chapter_id=${chapter.chapter_id}" style="cursor:pointer; color:white;">Edit</a>
        </span>
        <span class="badge bg-danger text-light "  style="cursor:pointer; color:white;">
         <a href="/c/view-chapter/?chapter_id=${chapter.chapter_id}" style="cursor:pointer; color:white;">Delete</a>
        </span>
      </td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to filter chapters based on search input
function filterChapters(searchTerm) {
    if (searchTerm === '') {
        filteredChapters = [...allChapters];
    } else {
        filteredChapters = allChapters.filter(chapter =>
            chapter.chapter_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    displayChapters(filteredChapters);
}

// Add event listener for the search input
document.getElementById('searchChapterInput').addEventListener('input', function() {
    const searchTerm = this.value;
    filterChapters(searchTerm);
});

// Call fetchChapters on page load
document.addEventListener("DOMContentLoaded", () => {
    fetchChapters();
});
