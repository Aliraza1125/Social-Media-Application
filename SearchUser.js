class UserFetcher {
  async fetchUsers(searchQuery = '') {
    const apiUrl = searchQuery ? `https://dummyjson.com/users/search?q=${searchQuery}` : 'https://dummyjson.com/users';
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.users && Array.isArray(data.users)) return data.users;
      throw new Error('Invalid response data');
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }
}

class UserRenderer {
  renderUser(user) {
    const userDiv = document.createElement('div');
    userDiv.classList.add('flex', 'items-center', 'justify-between');
    userDiv.innerHTML = `
      <div class="flex justify-between items-center gap-3">
        <div class="border-blue border-2 rounded-full cursor-pointer">
          <img src="${user.image}" alt="User Avatar" class="rounded-full object-cover w-12 h-11" />
        </div>
        <div class="flex flex-col ">
          <span class="font-semibold text-sm cursor-pointer text-[#262626] hover:text-[#c7c7c7] user-name">${user.firstName} ${user.lastName}</span>
          <span class="text-xs text-gray-500">${user.email}</span>
        </div>
      </div>
      <div class="follow mr-1 text-[#0095f6] font-semibold text-sm cursor-pointer" >
        <span class="followText">Follow</span>
      </div>
    `;

    const followButton = userDiv.querySelector('.follow');
    followButton.addEventListener('click', () => this.toggleFollow(userDiv));

    const userName = userDiv.querySelector('.user-name');
    userName.addEventListener('click', () => this.redirectToUserProfile(user.id));

    return userDiv;
  }

  toggleFollow(userDiv) {
    const followText = userDiv.querySelector('.followText');
    const toggleText = followText.textContent === "Follow" ? "Requested" : "Follow";
    setTimeout(() => {
      followText.textContent = toggleText;
      if (toggleText === "Requested") followText.classList.add('text-black', 'font-sm');
      else followText.classList.remove('text-black');
    }, 200);
  }

  redirectToUserProfile(userId) {
    window.location.href = `userProfile/profile.html?userId=${userId}`;
  }
}

class UserRendererController {
  constructor() {
    this.userFetcher = new UserFetcher();
    this.userRenderer = new UserRenderer();
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
  }

  async renderUsers(searchQuery) {
    const suggestedFriends = document.getElementById('suggestedUsers');
    suggestedFriends.innerHTML = '';

    const users = await this.userFetcher.fetchUsers(searchQuery);
    const initialUserCount = 5;
    const displayUsers = users.slice(0, initialUserCount);
    displayUsers.forEach(user => suggestedFriends.appendChild(this.userRenderer.renderUser(user)));

    // Add event listener to the "See All" button
    document.getElementById('seeAllUsers').addEventListener('click', async () => {
      suggestedFriends.innerHTML = ''; 
      const allUsers = await this.userFetcher.fetchUsers(); 
      allUsers.forEach(user => suggestedFriends.appendChild(this.userRenderer.renderUser(user)));
    });
  }

  handleSearchInputChange(event) {
    this.renderUsers(event.target.value.trim());
  }
}

const userRendererController = new UserRendererController();
document.getElementById('UserSearch').addEventListener('input', userRendererController.handleSearchInputChange);

// Render users initially
userRendererController.renderUsers('');
