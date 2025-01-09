// Function to get logged in email from localStorage
function getLoggedInEmail() {
    console.log('Getting logged in email...');
    const email = localStorage.getItem('loggedInEmail');
    console.log('Logged in email:', email);
    return email;
}

// Function to check if user is authorized
async function checkUserAuthorization() {
    try {
        console.log('Checking user authorization...');
        const loggedInEmail = getLoggedInEmail();
        if (!loggedInEmail) {
            console.error('No logged in email found');
            return false;
        }

        const response = await fetch('https://bni-data-backend.onrender.com/api/getUsers');
        const users = await response.json();
        console.log('Users data:', users);
        
        const isAuthorized = users.some(user => user.email === loggedInEmail);
        console.log('Is user authorized:', isAuthorized);
        return isAuthorized;
    } catch (error) {
        console.error('Error checking authorization:', error);
        return false;
    }
}

// Function to populate company info fields
function populateCompanyInfo(data) {
    console.log('Populating company info with:', data);
    document.getElementById('company-name').value = data.company_name || '';
    document.getElementById('company-address').value = data.company_address || '';
    document.getElementById('company-gstin').value = data.company_gst || '';
    document.getElementById('company-email').value = data.company_email || '';
    document.getElementById('company-phone').value = data.company_phone || '';
    document.getElementById('company-account').value = data.company_account_number || '';
    document.getElementById('company-ifsc').value = data.company_ifsc_code || '';
    document.getElementById('company-branch').value = data.company_bank_branch || '';
    document.getElementById('company-instagram').value = data.company_instagram || '';
    document.getElementById('company-facebook').value = data.company_facebook || '';
    document.getElementById('company-twitter').value = data.company_twitter || '';
    document.getElementById('company-youtube').value = data.company_youtube || '';
}

// Function to fetch company info with detailed debugging
async function fetchCompanyInfo() {
    try {
        console.log('Fetching company info...');
        const response = await fetch('https://bni-data-backend.onrender.com/api/company');
        
        if (!response.ok) {
            throw new Error('Failed to fetch company info');
        }

        const data = await response.json();
        const company = data.find(company => company.company_id === 1);
        
        if (!company) {
            throw new Error('Company not found');
        }

        populateCompanyInfo(company);
        console.log('Company info populated successfully');
    } catch (error) {
        console.error('Error fetching company info:', error);
        toastr.error('Failed to load company information');
    }
}

// Function to update company settings with detailed debugging


// Function to fetch logo information
async function fetchLogoInfo() {
    try {
        console.log('=== FETCH LOGO INFO START ===');
        const response = await fetch('https://bni-data-backend.onrender.com/api/getDisplayLogo');
        
        if (!response.ok) {
            throw new Error('Failed to fetch logo info');
        }

        const data = await response.json();
        console.log('Logo data received:', data);

        // Get the small text element
        const logoNameElement = document.getElementById('current-logo-name');
        
        if (data && data.length > 0 && logoNameElement) {
            console.log('Setting logo name:', data[0].display_image_name);
            logoNameElement.textContent = `Current logo: ${data[0].display_image_name}`;
        }
        
        console.log('=== FETCH LOGO INFO END ===');

    } catch (error) {
        console.error('Error fetching logo info:', error);
        toastr.error('Failed to load logo information');
    }
}

// Function to fetch GST types
async function fetchGstTypes() {
    try {
        console.log('=== FETCH GST TYPES START ===');
        const response = await fetch('https://bni-data-backend.onrender.com/api/getGstType');
        
        if (!response.ok) {
            throw new Error('Failed to fetch GST types');
        }

        const data = await response.json();
        console.log('GST types received:', data);
        return data;
    } catch (error) {
        console.error('Error fetching GST types:', error);
        toastr.error('Failed to load GST types');
        return [];
    }
}

// Function to fetch GST values
async function fetchGstValues() {
    try {
        console.log('=== FETCH GST VALUES START ===');
        const response = await fetch('https://bni-data-backend.onrender.com/api/getGstTypeValues');
        
        if (!response.ok) {
            throw new Error('Failed to fetch GST values');
        }

        const data = await response.json();
        console.log('GST values received:', data);
        return data;
    } catch (error) {
        console.error('Error fetching GST values:', error);
        toastr.error('Failed to load GST values');
        return [];
    }
}

// Function to populate GST and VAT dropdowns


// Add debugging to initialization
document.addEventListener('DOMContentLoaded', async function() {
    try {
        console.log('=== PAGE INITIALIZATION START ===');
        
        // Check authorization first
        const isAuthorized = await checkUserAuthorization();
        if (!isAuthorized) {
            console.warn('User not authorized');
            toastr.error('You are not authorized to view these settings');
            return;
        }

        // Fetch company info
        await fetchCompanyInfo();
        
        // Populate tax dropdowns
        await populateTaxDropdowns();

        console.log('=== PAGE INITIALIZATION COMPLETE ===');
    } catch (error) {
        console.error('Error during initialization:', error);
        toastr.error('Error loading page data');
    }
});

// Make sure this function is called when the page loads
document.addEventListener('DOMContentLoaded', async function() {
    try {
        await fetchLogoInfo();
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});

// Tax Settings

