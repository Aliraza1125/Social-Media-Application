class UserStories {
    constructor() {
        this.storiesContainer = document.getElementById('storiesContainer');
        this.rightClick = 0;
    }

    async fetchUserStories() {
        try {
            const response = await fetch('https://dummyjson.com/users');
            const data = await response.json();
            return data.users;
        } catch (error) {
            console.error('Error fetching user stories:', error);
            return [];
        }
    }

    renderUserStories(stories) {
        stories.forEach(story => {
            this.storiesContainer.innerHTML += `
                <div class="flex flex-col items-center cursor-pointer">
                    <div class="w-[70px] h-[70px] border-red-400 border-2 rounded-full overflow-hidden">
                        <img src="${story.image}" alt="User Avatar" class="w-full h-full object-cover p-1.5">
                    </div>
                    <span class="text-sm">${story.firstName}</span>
                </div>
            `;
        });

        const scrollBtnHandler = (scrollByValue) => {
            this.rightClick += scrollByValue;
            this.storiesContainer.scrollBy({ left: 500 * scrollByValue, behavior: 'smooth' });
            document.getElementById('scrollLeftBtn').classList.toggle('hidden', this.rightClick === 0);
        };

        document.getElementById('scrollRightBtn').addEventListener('click', () => scrollBtnHandler(1));
        document.getElementById('scrollLeftBtn').addEventListener('click', () => scrollBtnHandler(-1));
    }

    async start() {
        const stories = await this.fetchUserStories();
        this.renderUserStories(stories);
    }
}

// Create an instance of the UserStoryApp class and start it
const app = new UserStories();
app.start();
