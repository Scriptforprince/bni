let apiUrl = 'https://bni-data-backend.onrender.com/api/chapters';
let allChapters = [];
let filteredChapters = [];

// Function to show the loader
function showLoader() {
    document.getElementById('loader').style.display = 'flex';
}

// Function to hide the loader
function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}

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
        displayChapters(filteredChapters);
    } catch (error) {
        console.error('Error fetching chapters:', error);
    } finally {
        hideLoader();
    }
}

// Function to display chapters in the table
function displayChapters(chapters) {
    const tableBody = document.querySelector('table tbody');
    tableBody.innerHTML = '';

    chapters.forEach((chapter, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><b>${chapter.chapter_name}</b></td>
            <td>${chapter.region_id}</td>
            <td><b>${chapter.chapter_membership_fee}</b></td>
            <td>${chapter.chapter_logo}</td>
            <td>${chapter.chapter_meeting_day}</td>
            <td>${chapter.chapter_type}</td>
            <td><b>${chapter.chapter_kitty_fees}</b></td>
        
            <td>
                <span class="badge bg-${chapter.chapter_status === 'running' ? 'success' : 'danger'}">
                    ${chapter.chapter_status}
                </span>
            </td>
                     <td style="border: 1px solid grey">
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
