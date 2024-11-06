// memberDetails.js

document.addEventListener('DOMContentLoaded', async function () {
  // Get the member ID from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const memberId = urlParams.get('member_id');
console.log(memberId)
  if (!memberId) {
    alert('No member ID provided!');
    return;
  }

  // Show loader
  showLoader();

  try {
    // Fetch member data
    const memberResponse = await fetch(API_CONFIG.MEMBERS_API);
    if (!memberResponse.ok) throw new Error('Error fetching members data');

    const members = await memberResponse.json();
    const member = members.find(m => m.member_id === parseInt(memberId));

    if (!member) {
      alert('Member not found!');
      return;
    }

    // Fetch and populate region options
    const regionResponse = await fetch(API_CONFIG.REGIONS_API);
    const regions = await regionResponse.json();
    populateSelectOptions('region', regions, 'region_id', 'region_name', member.region_id);

    // Fetch and populate chapter options
    const chapterResponse = await fetch(API_CONFIG.CHAPTERS_API);
    const chapters = await chapterResponse.json();
    populateSelectOptions('chapter', chapters, 'chapter_id', 'chapter_name', member.chapter_id);

    // Fetch accolades data and populate checkboxes
    const accoladeResponse = await fetch(API_CONFIG.ACCOLADES_API);
    const accolades = await accoladeResponse.json();

    // Ensure member.accolades_id is an array
    let memberAccolades = member.accolades_id;

    if (typeof memberAccolades === 'string') {
      // If accolades_id is a comma-separated string, convert it to an array
      memberAccolades = memberAccolades.split(',').map(id => parseInt(id.trim()));
    } else if (!Array.isArray(memberAccolades)) {
      // If it's not an array, wrap it in an array
      memberAccolades = [memberAccolades];
    }

    // Now pass the accolades and member's accolade IDs
    populateAccoladeCheckboxes(accolades, memberAccolades);

    // Fetch and populate category options
    const categoryResponse = await fetch(API_CONFIG.CATEGORY_API);
    const categories = await categoryResponse.json();
    populateSelectOptions('category', categories, 'category_id', 'category_name', member.category_id);

    // Populate other member fields
    document.getElementById('memberFirstName').value = member.member_first_name || '';
    document.getElementById('memberLastName').value = member.member_last_name || '';
    document.getElementById('memberDateOfBirth').value = member.member_date_of_birth || '';
    document.getElementById('memberPhone').value = member.member_phone_number || '';
    document.getElementById('memberAlternatePhone').value = member.member_alternate_mobile_number || '';
    document.getElementById('memberEmail').value = member.member_email_address || '';
    document.getElementById('memberAddress').value = member.member_address || '';
    document.getElementById('addressPincode').value = member.address_pincode || '';
    document.getElementById('addressCity').value = member.address_city || '';
    document.getElementById('addressState').value = member.address_state || '';
    document.getElementById('memberInductionDate').value = member.member_induction_date ? member.member_induction_date.substring(0, 10) : '';
    document.getElementById('memberCurrentMembership').value = member.member_current_membership || '';
    document.getElementById('memberRenewalDate').value = member.member_renewal_date ? member.member_renewal_date.substring(0, 10) : '';
    document.getElementById('memberRenewalDueDate').value = member.member_renewal_due_date ? member.member_renewal_due_date.substring(0, 10) : '';
    document.getElementById('memberLastRenewalDate').value = member.member_last_renewal_date ? member.member_last_renewal_date.substring(0, 10) : '';
    document.getElementById('memberGSTNumber').value = member.member_gst_number || '';
    document.getElementById('memberCompanyName').value = member.member_company_name || '';
    document.getElementById('memberCompanyAddress').value = member.member_company_address || '';
    document.getElementById('memberCompanyState').value = member.member_company_state || '';
    document.getElementById('memberCompanyCity').value = member.member_company_city || '';
    document.getElementById('memberPhoto').src = member.member_photo || '';
    document.getElementById('memberStatus').value = member.member_status || ''; 
    document.getElementById('memberCategory').value = member.member_category || '';
    document.getElementById('memberWebsite').value = member.member_website || '';
    document.getElementById('memberCompanyLogo').src = member.member_company_logo || '';
    document.getElementById('lateFeeApplicable').value = member.late_fee_applicable || '';

  } catch (error) {
    console.error('Error fetching member details:', error);
  } finally {
    // Hide loader
    hideLoader();
  }
});

// Function to populate accolade checkboxes
function populateAccoladeCheckboxes(accolades, memberAccolades) {
  const accoladesContainer = document.getElementById('accoladesContainer');
  accoladesContainer.innerHTML = ''; // Clear any existing checkboxes

  accolades.forEach(accolade => {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `accolade-${accolade.accolade_id}`;
    checkbox.value = accolade.accolade_id;
    checkbox.name = 'accolades[]'; // Name it as an array to send multiple values
    if (memberAccolades.includes(accolade.accolade_id)) {
      checkbox.checked = true; // Check if member has this accolade
    }

    const label = document.createElement('label');
    label.htmlFor = `accolade-${accolade.accolade_id}`;
    label.textContent = accolade.accolade_name;

    const container = document.createElement('div');
    container.classList.add('form-check'); // Add Bootstrap's form-check class
    container.appendChild(checkbox);
    container.appendChild(label);

    accoladesContainer.appendChild(container); // Append each checkbox to the container
  });
}

// Function to populate select options dynamically
function populateSelectOptions(selectId, data, valueField, textField, selectedValue) {
  const selectElement = document.getElementById(selectId);
  selectElement.innerHTML = '<option value="">Select</option>'; // Clear existing options and add default option

  data.forEach(item => {
    const option = document.createElement('option');
    option.value = item[valueField];
    option.textContent = item[textField];
    if (item[valueField] === selectedValue) {
      option.selected = true; // Set the option as selected if it matches the member's data
    }
    selectElement.appendChild(option);
  });
}

// Show/hide loader functions
function showLoader() {
  document.getElementById('loader').style.display = 'flex';
}

function hideLoader() {
  document.getElementById('loader').style.display = 'none';
}
