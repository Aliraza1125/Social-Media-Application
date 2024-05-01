const posts = [
  // Sample posts data
  { id: 1, image: 'https://source.unsplash.com/random/12' },
  { id: 2, image: 'https://source.unsplash.com/random/88' },
  { id: 4, image: 'https://source.unsplash.com/random/89' },
  { id: 5, image: 'https://source.unsplash.com/random/5' },
  { id: 3, image: 'https://source.unsplash.com/random/457' },
  { id: 6, image: 'https://source.unsplash.com/random/98' },
  { id: 8, image: 'https://source.unsplash.com/random/99' },
  { id: 2, image: 'https://source.unsplash.com/random/88' },
  { id: 7, image: 'https://source.unsplash.com/random/66' }, 
   { id: 4, image: 'https://source.unsplash.com/random/89' },
  { id: 1, image: 'https://source.unsplash.com/random/12' },
  { id: 6, image: 'https://source.unsplash.com/random/98' },
  { id: 3, image: 'https://source.unsplash.com/random/457' },
  { id: 2, image: 'https://source.unsplash.com/random/88' },
  { id: 5, image: 'https://source.unsplash.com/random/5' },
  { id: 8, image: 'https://source.unsplash.com/random/99' },
  { id: 7, image: 'https://source.unsplash.com/random/66' },
  { id: 2, image: 'https://source.unsplash.com/random/88' },
  { id: 1, image: 'https://source.unsplash.com/random/12' },
  { id: 4, image: 'https://source.unsplash.com/random/89' },
  { id: 3, image: 'https://source.unsplash.com/random/457' },
  { id: 6, image: 'https://source.unsplash.com/random/98' },
  { id: 5, image: 'https://source.unsplash.com/random/5' },
  { id: 8, image: 'https://source.unsplash.com/random/99' },
  { id: 7, image: 'https://source.unsplash.com/random/66' }, 
   { id: 2, image: 'https://source.unsplash.com/random/88' },
  { id: 1, image: 'https://source.unsplash.com/random/12' },
  { id: 4, image: 'https://source.unsplash.com/random/89' },
  { id: 3, image: 'https://source.unsplash.com/random/457' },
  { id: 6, image: 'https://source.unsplash.com/random/98' },
  { id: 5, image: 'https://source.unsplash.com/random/5' },
  { id: 8, image: 'https://source.unsplash.com/random/99' },
  { id: 7, image: 'https://source.unsplash.com/random/66' },
  { id: 4, image: 'https://source.unsplash.com/random/89' },
  { id: 1, image: 'https://source.unsplash.com/random/12' },
  { id: 6, image: 'https://source.unsplash.com/random/98' },
  { id: 3, image: 'https://source.unsplash.com/random/457' },
  { id: 8, image: 'https://source.unsplash.com/random/99' },
  { id: 5, image: 'https://source.unsplash.com/random/5' },
  { id: 1, image: 'https://source.unsplash.com/random/12' },
  { id: 7, image: 'https://source.unsplash.com/random/66' }, 
   { id: 2, image: 'https://source.unsplash.com/random/88' },
  { id: 3, image: 'https://source.unsplash.com/random/457' },
  { id: 4, image: 'https://source.unsplash.com/random/89' },
  { id: 5, image: 'https://source.unsplash.com/random/5' },
  { id: 6, image: 'https://source.unsplash.com/random/98' },
  { id: 7, image: 'https://source.unsplash.com/random/66' },
  { id: 8, image: 'https://source.unsplash.com/random/99' },
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
