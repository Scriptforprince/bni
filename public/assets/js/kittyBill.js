function showLoader() {
    document.getElementById('loader').style.display = 'flex';
}

function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}

(async function() {
    const regionFilter = document.getElementById('region-filter');
    const chapterFilter = document.getElementById('chapter-filter');
    const regionButton = document.querySelector('.region-button');
    const chapterButton = document.querySelector('.chapter-button');
    const chapterInfo = document.querySelector('.chapter-information');
    const totalMembersElement = document.querySelector('.total_members');

    let selectedRegion = null;
    let selectedChapter = null;
    let members = [];

    try {
        showLoader();

        // Fetch and populate regions
        const regions = await fetch('https://bni-data-backend.onrender.com/api/regions').then(res => res.json());
        regions.forEach(region => {
            const li = document.createElement('li');
            li.innerHTML = `<a class="dropdown-item" href="javascript:void(0);" data-id="${region.region_id}">${region.region_name}</a>`;
            regionFilter.appendChild(li);
        });

        // Fetch and populate chapters
        const chapters = await fetch('https://bni-data-backend.onrender.com/api/chapters').then(res => res.json());
        chapters.forEach(chapter => {
            const li = document.createElement('li');
            li.innerHTML = `<a class="dropdown-item" href="javascript:void(0);" data-id="${chapter.chapter_id}">${chapter.chapter_name}</a>`;
            chapterFilter.appendChild(li);
        });

        // Fetch all members data once (this will be used for filtering chapters based on region)
        members = await fetch('https://bni-data-backend.onrender.com/api/members').then(res => res.json());
        console.log("Fetched members data:", members);  // Log the members data to see the structure

    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to load data. Please try again later.');
    } finally {
        hideLoader();
    }

    // Handle region selection
    regionFilter.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            selectedRegion = e.target.dataset.id;
            const regionName = e.target.innerText;
            regionButton.innerHTML = `<i class="ti ti-sort-descending-2 me-1"></i> ${regionName}`;
            // Highlight the selected item in the dropdown
            const allRegionItems = regionFilter.querySelectorAll('a');
            allRegionItems.forEach(item => item.classList.remove('active'));
            e.target.classList.add('active');
            autofillFields();
        }
    });

    // Handle chapter selection
    chapterFilter.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            selectedChapter = e.target.dataset.id;
            const chapterName = e.target.innerText;
            chapterButton.innerHTML = `<i class="ti ti-sort-descending-2 me-1"></i> ${chapterName}`;
            // Highlight the selected item in the dropdown
            const allChapterItems = chapterFilter.querySelectorAll('a');
            allChapterItems.forEach(item => item.classList.remove('active'));
            e.target.classList.add('active');
            autofillFields();
        }
    });

    async function autofillFields() {
        if (selectedRegion && selectedChapter) {
            try {
                showLoader();  // Show loader before fetch
    
                // Fetch chapter details using chapter_id
                const chapter = await fetch(`https://bni-data-backend.onrender.com/api/getChapter/${selectedChapter}`)
                    .then(res => res.json());
                console.log("Fetched Chapter Details:", chapter);
    
                if (chapter) {
                    document.querySelector('.chapter_name').innerText = chapter.chapter_name || 'N/A';
                    document.querySelector('.chapter_day').innerText = chapter.chapter_meeting_day || 'N/A';
                    document.querySelector('.meeting_venue').innerText = chapter.meeting_hotel_name || 'N/A';
                    document.querySelector('.meeting_fee').innerText = chapter.chapter_kitty_fees || 'N/A';
                    document.querySelector('.visitor_fee').innerText = chapter.chapter_visitor_fees || 'N/A';
    
                    // Ensure that the value is one of the valid options
                    const validBillingFrequencies = ['weekly', 'monthly', 'quartely', 'half_yearly', 'yearly'];
                    const billingFrequency = validBillingFrequencies.includes(chapter.kitty_billing_frequency) ? chapter.kitty_billing_frequency : 'weekly';
                    document.querySelector('#kitty_billing_frequency').value = billingFrequency;
    
                    // Show chapter information
                    chapterInfo.style.display = 'block';
    
                    // Log selected chapter and filter members by chapter_id
                    console.log("Selected Chapter ID:", selectedChapter);
    
                    // Now, calculate total members in the selected chapter
                    const totalMembers = members.filter(member => member.chapter_id === parseInt(selectedChapter)).length;
                    console.log("Filtered Members for Chapter:", totalMembers);  // Log filtered members count
    
                    totalMembersElement.innerText = totalMembers || 'N/A';
                }
    
            } catch (error) {
                console.error('Error fetching chapter details:', error);
                alert('Failed to load chapter details.');
            } finally {
                hideLoader();  // Hide loader after data is loaded
            }
        }
    }
    

})();
