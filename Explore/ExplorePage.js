const posts = [
  // Sample posts data
  { id: 2, image: 'https://loremflickr.com/200/200?random=12' },
  { id: 4, image: 'https://loremflickr.com/200/200?random=34' },
  { id: 5, image: 'https://loremflickr.com/200/200?random=56' },
  { id: 3, image: 'https://loremflickr.com/200/200?random=78' },
  { id: 6, image: 'https://loremflickr.com/200/200?random=90' },
  { id: 8, image: 'https://loremflickr.com/200/200?random=21' },
  { id: 2, image: 'https://loremflickr.com/200/200?random=43' },
  { id: 7, image: 'https://loremflickr.com/200/200?random=65' }, 
  { id: 4, image: 'https://loremflickr.com/200/200?random=87' },
  { id: 1, image: 'https://loremflickr.com/200/200?random=19' },
  { id: 6, image: 'https://loremflickr.com/200/200?random=31' },
  { id: 3, image: 'https://loremflickr.com/200/200?random=53' },
  { id: 2, image: 'https://loremflickr.com/200/200?random=75' },
  { id: 5, image: 'https://loremflickr.com/200/200?random=97' },
  { id: 8, image: 'https://loremflickr.com/200/200?random=24' },
  { id: 7, image: 'https://loremflickr.com/200/200?random=46' },
  { id: 2, image: 'https://loremflickr.com/200/200?random=68' },
  { id: 1, image: 'https://loremflickr.com/200/200?random=80' },
  { id: 4, image: 'https://loremflickr.com/200/200?random=14' },
  { id: 3, image: 'https://loremflickr.com/200/200?random=36' },
  { id: 6, image: 'https://loremflickr.com/200/200?random=58' },
  { id: 5, image: 'https://loremflickr.com/200/200?random=70' },
  { id: 8, image: 'https://loremflickr.com/200/200?random=92' },
  { id: 7, image: 'https://loremflickr.com/200/200?random=13' }, 
  { id: 2, image: 'https://loremflickr.com/200/200?random=35' },
  { id: 1, image: 'https://loremflickr.com/200/200?random=57' },
  { id: 4, image: 'https://loremflickr.com/200/200?random=79' },
  { id: 3, image: 'https://loremflickr.com/200/200?random=91' },
  { id: 6, image: 'https://loremflickr.com/200/200?random=23' },
  { id: 5, image: 'https://loremflickr.com/200/200?random=45' },
  { id: 8, image: 'https://loremflickr.com/200/200?random=67' },
  { id: 7, image: 'https://loremflickr.com/200/200?random=89' },
  { id: 4, image: 'https://loremflickr.com/200/200?random=20' },
  { id: 1, image: 'https://loremflickr.com/200/200?random=42' },
  { id: 6, image: 'https://loremflickr.com/200/200?random=64' },
  { id: 3, image: 'https://loremflickr.com/200/200?random=86' },
  { id: 8, image: 'https://loremflickr.com/200/200?random=10' },
  { id: 5, image: 'https://loremflickr.com/200/200?random=32' },
  { id: 1, image: 'https://loremflickr.com/200/200?random=54' },
  { id: 7, image: 'https://loremflickr.com/200/200?random=76' }, 
  { id: 2, image: 'https://loremflickr.com/200/200?random=98' },
  { id: 3, image: 'https://loremflickr.com/200/200?random=11' },
  { id: 4, image: 'https://loremflickr.com/200/200?random=33' },
  { id: 5, image: 'https://loremflickr.com/200/200?random=55' },
  { id: 6, image: 'https://loremflickr.com/200/200?random=77' },
  { id: 7, image: 'https://loremflickr.com/200/200?random=99' },
  { id: 8, image: 'https://loremflickr.com/200/200?random=22' },
  
];

function renderPosts() {
  const gridContainer = document.getElementById('grid-container');
  gridContainer.innerHTML = '';
  posts.forEach(post => {
      const gridItem = document.createElement('div');
      gridItem.classList.add('aspect-w-1', 'aspect-h-1', 'relative', 'cursor-pointer', 'shadow-md', 'group');
      gridItem.innerHTML = `
          <img src="${post.image}" alt="Post Image" class="object-cover rounded-md w-full h-full">
          <div class="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div class="flex items-center text-white">
                  <svg viewBox="0 0 24 24" class="h-6 w-6 text-white fill-current mr-1">
                      <path d="M12 20l-7 -7a4 4 0 0 1 6.5 -6a.9 .9 0 0 0 1 0a4 4 0 0 1 6.5 6l-7 7" />
                  </svg>
                  <span>10</span>
              </div>
          </div>
      `;
      gridItem.addEventListener('click', () => {
          console.log('Clicked on post with id:', post.id);
      });
      gridContainer.appendChild(gridItem);
  });
}

renderPosts();

const LoggedInUserData = JSON.parse(localStorage.getItem("users"));
if (!LoggedInUserData) {
  window.location.href = "../Login/login.html";
}

const userProfilePic = document.querySelector('#userProfilePic');
const username = document.querySelector('#username');
const userEmail = document.querySelector('#userEmail');

userProfilePic.src = LoggedInUserData.image;
username.textContent = LoggedInUserData.username;
userEmail.textContent = LoggedInUserData.email;

const profileLink = document.getElementById('profileLink2');
const profileLinkUser = document.getElementById('username');

profileLink.addEventListener('click', redirectToProfile);
profileLinkUser.addEventListener('click', redirectToProfile);

function redirectToProfile(event) {
  event.preventDefault();
  window.location.href = `../userProfile/profile.html?userId=${LoggedInUserData.id}`;
}

const signOutButton = document.getElementById('logOut2');
if (signOutButton) {
  signOutButton.addEventListener("click", signOut);
}

function signOut(event) {
  event.preventDefault();
  localStorage.removeItem("users");
  window.location.href = "../Login/login.html";
}
