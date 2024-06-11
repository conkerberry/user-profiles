document.addEventListener('DOMContentLoaded', () => {
  const profileContainer = document.getElementById('profile-container');
  const profileForm = document.getElementById('profile-form');
  const toggleDarkMode = document.getElementById('toggle-dark-mode');
  const addProfileBtn = document.getElementById('add-profile');
  const cancelBtn = document.getElementById('cancel');
  const profileDetailsSection = document.getElementById('profile-details');
  const backToProfilesBtn = document.getElementById('back-to-profiles');
  let editingProfileId = null;

  let profiles = JSON.parse(localStorage.getItem('profiles')) || [
      { name: 'Matt Smith', email: 'matt123@gmail.com', bio: '', contact: '1234567890', address: 'ABC St, California', picture: 'person1.png' },
      { name: 'Jane ', email: 'jane@example.com', bio: 'A short bio about Jane.', contact: '234-567-8901', address: '456 Elm St', picture: 'jane.jpg' },
      { name: 'Bob Johnson', email: 'bob@example.com', bio: 'A short bio about Bob.', contact: '345-678-9012', address: '789 Pine St', picture: 'bob.jpg' },
  ];

  const saveProfiles = () => {
      localStorage.setItem('profiles', JSON.stringify(profiles));
  };

  const loadProfiles = () => {
      profileContainer.innerHTML = ''; 
      profiles.forEach((profile, index) => {
          const profileBox = document.createElement('div');
          profileBox.classList.add('profile-box');
          profileBox.innerHTML = `
              <img src="${profile.picture}" alt="Profile Picture">
              <h2>${profile.name}</h2>
              <div class="profile-actions">
                  <button onclick="editProfile(${index})">Edit</button>
                  <button onclick="deleteProfile(${index})" style="color: red;">Delete</button>
              </div>
          `;
          profileBox.addEventListener('click', (event) => {
              if (!event.target.closest('.profile-actions')) {
                  showProfileDetails(index);
              }
          });
          profileContainer.appendChild(profileBox);
      });
  };

  const showProfileDetails = (index) => {
      const profile = profiles[index];
      document.getElementById('details-name').textContent = profile.name;
      document.getElementById('details-picture').src = profile.picture;
      document.getElementById('details-email').textContent = `Email: ${profile.email}`;
      document.getElementById('details-bio').textContent = `Bio: ${profile.bio}`;
      document.getElementById('details-contact').textContent = `Contact Number: ${profile.contact}`;
      document.getElementById('details-address').textContent = `Address: ${profile.address}`;
      profileContainer.classList.add('hidden');
      profileDetailsSection.classList.remove('hidden');
  };


  window.editProfile = (index) => {
      const profile = profiles[index];
      profileForm.name.value = profile.name;
      profileForm.email.value = profile.email;
      profileForm.bio.value = profile.bio;
      profileForm.contact.value = profile.contact;
      profileForm.address.value = profile.address;
      editingProfileId = index;
      profileContainer.classList.add('hidden');
      profileDetailsSection.classList.add('hidden');
      document.getElementById('edit-profile').classList.remove('hidden');
  };

  
  window.deleteProfile = (index) => {
      if (confirm('Are you sure you want to delete this profile?')) {
          profiles.splice(index, 1);
          saveProfiles();
          loadProfiles();
      }
  };

  
  profileForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const profile = {
          name: profileForm.name.value,
          email: profileForm.email.value,
          bio: profileForm.bio.value,
          contact: profileForm.contact.value,
          address: profileForm.address.value,
      };

      const file = profileForm.picture.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = () => {
              profile.picture = reader.result;
              updateProfile(profile);
          };
          reader.readAsDataURL(file);
      } else {
          profile.picture = profiles[editingProfileId]?.picture || 'default.jpg';
          updateProfile(profile);
      }
  });

  
  const updateProfile = (profile) => {
      if (editingProfileId !== null) {
          profiles[editingProfileId] = profile;
          editingProfileId = null;
      } else {
          profiles.push(profile);
      }
      saveProfiles();
      loadProfiles();
      profileForm.reset();
      document.getElementById('edit-profile').classList.add('hidden');
      profileContainer.classList.remove('hidden');
      profileDetailsSection.classList.add('hidden');
      alert('Profile updated!');
  };

  
  toggleDarkMode.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
  });

  
  addProfileBtn.addEventListener('click', () => {
      profileForm.reset();
      editingProfileId = null;
      profileContainer.classList.add('hidden');
      profileDetailsSection.classList.add('hidden');
      document.getElementById('edit-profile').classList.remove('hidden');
  });

  
  cancelBtn.addEventListener('click', () => {
      if (confirm('Are you sure? Your changes will not be saved')) {
          document.getElementById('edit-profile').classList.add('hidden');
          profileContainer.classList.remove('hidden');
          profileDetailsSection.classList.add('hidden');
      }
  });

  
  backToProfilesBtn.addEventListener('click', () => {
      profileDetailsSection.classList.add('hidden');
      profileContainer.classList.remove('hidden');
  });

  
  loadProfiles();
});
