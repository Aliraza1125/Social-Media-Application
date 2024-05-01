class SocialMediaApp {
    constructor() {
      this.userData = JSON.parse(localStorage.getItem("users"));
      this.sidebar = document.getElementById("leftBar");
      this.header = document.getElementById("header");
      this.main = document.getElementById("main");
   
  
      this.init();
    }
  
    async init() {
      if (!this.userData) {
        window.location.href = "./Login/login.html";
        return;
      }
  
      try {
        await this.fetchAndUpdatePostsCount();
        this.updateUserInfo();
        this.addEventListeners();
        this.setSidebarAndMainHeight();
      } catch (error) {
        console.error("Error initializing app:", error);
      }
    }
  
    async fetchAndUpdatePostsCount() {
      const response = await fetch(`https://dummyjson.com/users/${this.userData.id}/posts`);
      if (!response.ok) {
        throw new Error("Failed to fetch user posts");
      }
      const { total: totalPosts } = await response.json();
      document.getElementById('postsCount').textContent = totalPosts;
    }
  
    updateUserInfo() {
      this.setImageAndContent('#profilePic', null, this.userData.image);
      this.setImageAndContent('#userProfilePic', null, this.userData.image);
      this.setImageAndContent('#username', this.userData.username);
      this.setImageAndContent('#usernamenav', this.userData.username);
      this.setImageAndContent('#userEmail', this.userData.email);
    }
  
    setImageAndContent(selector, content, source) {
      const element = document.querySelector(selector);
      if (element) {
        if (content) element.textContent = content;
        if (source) element.src = source;
      }
    }
  
    addEventListeners() {
      document.getElementById('profileLink1').addEventListener('click', (event) => {
      
        event.preventDefault();
        window.location.href = `./userProfile/profile.html?userId=${this.userData.id}`; 
    
      });
      document.getElementById('profileLink').addEventListener('click', (event) => {
      
        event.preventDefault();
        window.location.href = `./userProfile/profile.html?userId=${this.userData.id}`; 
    
      }); 
        document.getElementById('profileLink2').addEventListener('click', (event) => {
      
        event.preventDefault();
        window.location.href = `./userProfile/profile.html?userId=${this.userData.id}`; 
    
      });
  
      document.getElementById('navbarDropdown').addEventListener('click', () => {
        document.getElementById('dropdownMenu').classList.toggle('hidden');
      });

      document.getElementById('username').addEventListener('click', (event) => {

        event.preventDefault();
        window.location.href = `./userProfile/profile.html?userId=${this.userData.id}`; 
    
      });
  
      const signOutButton = document.getElementById('logOut');
      if (signOutButton) {
        signOutButton.addEventListener("click", async (event) => {
          event.preventDefault();
          localStorage.removeItem("users");
          window.location.href = "./Login/login.html";
        });
      }

    }
  
    setSidebarAndMainHeight() {
      const screenHeight = window.innerHeight;
      const headerHeight = this.header.offsetHeight;
      const sidebarHeight = screenHeight - headerHeight;
      this.sidebar.style.height = `${sidebarHeight - 20}px`;
      this.main.style.height = `${sidebarHeight}px`;
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    new SocialMediaApp();
  });
  