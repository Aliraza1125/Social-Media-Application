document.addEventListener("DOMContentLoaded", async function () {

  const sidebar = document.getElementById("leftBar");
  const header = document.getElementById("header");
  const main = document.getElementById("main");

  const screenHeight = window.innerHeight;
  const headerHeight = header.offsetHeight;
  const sidebarHeight = screenHeight - headerHeight;

  sidebar.style.height = `${sidebarHeight - 20}px`;
  main.style.height = `${sidebarHeight}px`;

  const queryParams = new URLSearchParams(window.location.search);
  const userId = queryParams.get('userId');
  const LoggedInUserData = JSON.parse(localStorage.getItem("users"));


  if (!LoggedInUserData && !userId) {
    window.location.href = "Login/login.html";
    return;
  }

  try {
    const [userDataResponse, userPostsResponse] = await Promise.all([
      fetch(`https://dummyjson.com/users/${userId}`),
      fetch(`https://dummyjson.com/users/${userId}/posts`)
    ]);
    const [userData, userPostsData] = await Promise.all([
      userDataResponse.json(),
      userPostsResponse.json()
    ]);

    renderProfileInfo(userData);
    renderPosts(userPostsData);
  } catch (error) {
    console.error("Error fetching user data and posts:", error);
  }

  function renderProfileInfo(userData) {
    const { image, username, email, firstName, lastName } = userData;
    if (image) {
      document.querySelector('#profilePic2').src = image;
      document.querySelector('#userProfilePic').src = LoggedInUserData.image;
    }
    if (username) {
      document.querySelector('#username').textContent = LoggedInUserData.username;
      document.querySelector('#usernamenav2').textContent = username;
    }
    if (email) {
      document.querySelector('#userEmail').textContent = LoggedInUserData.email;
    }
    if (firstName && lastName) {
      document.querySelector('#FullName').textContent = `${firstName} ${lastName}`;
    }
  }

  function renderPosts(data) {
    const postsContainer = document.getElementById("postsContainer");
    
    if (Array.isArray(data.posts)) {
      const totalPosts = data.posts.length;
      document.getElementById("postsCount2").innerHTML = totalPosts;

      data.posts.forEach(async post => {
        try {
          const response = await fetch(`https://dummyjson.com/comments/post/${post.id}`);
          const comments = await response.json();
          const numComments = comments.total;

          const postHTML = `
          <div class="w-1/3 p-px md:px-3">
          <a href="#" class="post-link" data-post-id="${post.id}">
            <article class="post bg-gray-100 text-white relative pb-full md:mb-6">
              <img class="w-full h-full absolute left-0 top-0 object-cover" src="https://loremflickr.com/200/200?random=${post.id}" alt="image">
              <i class="fas fa-square absolute right-0 top-0 m-1"></i>
              <div class="overlay bg-gray-800 bg-opacity-25 w-full h-full absolute left-0 top-0 hidden">
                <div class="flex justify-center items-center space-x-4 h-full">
                  <span class="p-2"><i class="fas fa-heart"></i> ${post.reactions.likes}</span>
                  <span class="p-2 comment-count"><i class="fas fa-comment"></i> ${numComments}</span>
                </div>
              </div>
            </article>
          </a>
        </div>
          `;
          postsContainer.innerHTML += postHTML;

          document.querySelectorAll('.post-link').forEach(link => {
            link.addEventListener('click', (event) => {
              event.preventDefault();
              const postId = link.dataset.postId;
              fetchAndDisplayComments(postId);
            });
          });
        } catch (error) {
          console.error("Error fetching comments:", error);
        }
      });
    } else {
      console.error("Data does not contain an array of posts:", data);
    }
  }

  async function fetchAndDisplayComments(postId, commentBody = "") {
    try {
      let userData = JSON.parse(localStorage.getItem("users"));
      let loggedInUserId = userData.id;

      let newComment = {
        "id": 341,
        "body": commentBody,
        "postId": postId,
        "user": {
          "id": JSON.parse(localStorage.getItem('users')).id,
          "username": JSON.parse(localStorage.getItem('users')).username
        }
      }

      console.log("newComment", newComment)

      // Fetch post details
      const postRes = await fetch(`https://dummyjson.com/posts/${postId}`);
      const postData = await postRes.json();
      const postUserId = postData.userId;
      console.log(postUserId)

      const res = await fetch(`https://dummyjson.com/comments/post/${postId}`);
      const data = await res.json();
      const comments = data.comments;
      console.log(comments)

      const Userres = await fetch(`https://dummyjson.com/users/${userId}`);
      const UserData = await Userres.json();

     

      if (commentBody != "") {
        comments.push(newComment);
      }

      const modal = document.getElementById("commentsModal");
      const modalHeader = document.getElementById("CommentHeader");
      const modalBody = modal.querySelector(".modal-body");
      modalBody.innerHTML = "";

      modalHeader.innerHTML = `
            <div class="flex justify-between items-center gap-3">
                <div class="border-blue border-2 rounded-full cursor-pointer">
                    <img src="${UserData.image}" alt="User Avatar" class="rounded-full object-cover w-12 h-11" />
                </div>
                <div class="flex flex-col ">
              
                    <span class="font-semibold text-sm cursor-pointer text-[#262626] hover:text-[#c7c7c7] user-name">${UserData.firstName} ${UserData.lastName}</span>
                    <span class="text-xs text-gray-500">${UserData.email}</span>
                </div>
            </div>
            <div class="follow mr-1 text-[#0095f6] font-semibold text-sm cursor-pointer">
                <span class="followText">Follow</span>
            </div>
        `;
      if (Array.isArray(comments) && comments.length > 0) {


        modalBody.innerHTML += `
          <div class="my-5 p-2 w-full lg:w-[45%]  h-[450px]">
            <img src="https://source.unsplash.com/random/${postId}" alt="Post Image" class="h-[420px] object-cover w-full" />
          </div>
        `;
        const parentDiv = document.createElement("div");
        parentDiv.classList.add("parent-div", "flex",
          "flex-col",
          "justify-between",
          "lg:w-[55%]",
          "w-full",
          "h-[450px]",
          "my-5",
          "p-2",
          "gap-2",
          "overflow-y-scroll",
          "no-scrollbar"
        );


        const commentsContainer = document.createElement("div");
        commentsContainer.classList.add(
          "commentscontainer",
          "flex",
          "flex-col",
          "justify-between",
          "lg:w-full",
          "w-full",

          "gap-2"
        );

        await Promise.all(
          comments.map(async (comment) => {
            const userRes = await fetch(
              `https://dummyjson.com/users/${comment.user.id}`
            );
            const user = await userRes.json();

            const commentDiv = document.createElement("div");
            commentDiv.id = "singlecomment";
            commentDiv.classList.add(
              "flex",
              "items-start",
              "gap-3",
              "justify-between"
            );
            commentDiv.innerHTML = `
              <div class="w-full lg:w-[70px] h-[60px] border-blue border-2 rounded-full overflow-hidden">
                <img src="${user.image}" alt="User Avatar" class="w-full h-full object-cover p-1 border-blue border-2 rounded-full" />
              </div>
              <div class="flex justify-between w-full mt-[10px]">
                <div class="flex gap-2 items-start ">
                  <div>
                  <a href="../userProfile/profile.html?userId=${user.id}">
                    <span class="cursor-pointer text-sm font-semibold text-[#262626] hover:text-[#c7c7c7]">${comment.user.username}</span></a>
                  </div>
                  <div>
                    <span class="commentBody text-[#000000]  text-[16px] text-justify" id="commentbody">${comment.body}</span>
                  </div>
                </div>
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <span class="cursor-pointer" onclick="toggleHeart(this)">
                      <i class="fa-regular fa-heart text-[#737373] hover:text-[#c7c7c7]"></i>
                    </span>
                  </div>
                  <div class="comment-options cursor-pointer flex items-center gap-2">
                  ${(comment.user.id === loggedInUserId || postUserId === loggedInUserId)
                    ? `
                        <button class="edit-comment-btn" data-comment-id="${comment.id}"><i class="fa-regular fa-pen-to-square text-[#737373] hover:text-[#c7c7c7]"></i></button>
                        <button class="delete-comment-btn" data-comment-id="${comment.id}"><i class="fa-solid fa-trash-can text-[#737373] hover:text-[#c7c7c7]"></i></button>
                      `
                    : ""
                }
                  </div>
                </div>
              </div>
        
                          <!-- Delete Modal -->
  
                <div id="popup-modal" tabindex="-1" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-black bg-opacity-50">
                    <div class="relative p-4 w-full max-w-md max-h-full">
                          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                               <button type="button" class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal" id="close-modal">
                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
              <span class="sr-only">Close modal</span>
                        </button>
                       <div class="p-4 md:p-5 text-center">
              <svg class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
              </svg>
              <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this comment?</h3>
              <button data-modal-hide="popup-modal" data-confirm-delete type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                  Yes, I'm sure
              </button>
              <button data-modal-hide="popup-modal" data-cancel-delete type="button" class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">No, cancel</button>
                                    </div>
                             </div>
                          </div>
                    </div>
            `;
            commentsContainer.appendChild(commentDiv);
          })

        );



        const inputField = document.createElement("div");
        inputField.innerHTML = `
          <div class="mx-2 my-4 flex justify-between items-center">
            <input id="comment-input1" type="text" placeholder="Only for Edit Comment..." class="w-full focus:outline-none text-[#737373]">
            <div class="flex items-center gap-3">
              <span id="post-text1" class="cursor-pointer text-[#0064e0]  hover:text-[#0065e07e]">Post</span>
              <span class="cursor-pointer"><i class="fa-regular fa-face-smile text-[#737373] hover:text-[#c7c7c7]"></i></span>
            </div>
          </div>
          <div class="mx-2 my-4 text-[#737373]">
            <hr style="border-top: 1px solid #737373;">
          </div>
        `;

        parentDiv.appendChild(commentsContainer);


        parentDiv.appendChild(inputField)

        modalBody.appendChild(parentDiv);



        let clickedEditButton;

        // Event listener for editing comments
        document.querySelectorAll(".edit-comment-btn").forEach((button) => {
          button.addEventListener("click", () => {
            console.log("Edit button clicked");
            const commentContainer = button.closest("#singlecomment");
            const commentTextElement = commentContainer.querySelector(".commentBody");

            if (!commentTextElement) {
              console.error("Comment text element not found.");
              return;
            }

            const commentText = commentTextElement.innerText;

            const commentInput = document.getElementById("comment-input1");
            commentInput.value = commentText;

            clickedEditButton = button;

            const postBtn = document.getElementById("post-text1");
            postBtn.dataset.commentId = button.dataset.commentId;
            console.log("Comment ID:", postBtn.dataset.commentId);
          });
        });

        // Event listener for posting edited comments
        const postBtn = document.getElementById("post-text1");
        console.log(postBtn);
        postBtn.addEventListener("click", async () => {
          const commentId = postBtn.dataset.commentId;
          console.log("Post button clicked. Comment ID:", commentId);
          const updatedText = document.getElementById("comment-input1").value;
  

          try {
            const response = await fetch(`https://dummyjson.com/comments/${commentId}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                body: updatedText,
              }),
            });

            if (!response.ok) {
              throw new Error("Failed to update comment");
            }

            // Check if comment text element exists
            const commentContainer = clickedEditButton.closest("#singlecomment");
            const commentTextElement = commentContainer.querySelector(".commentBody");

            console.log("Comment text element:", commentTextElement);
            if (!commentTextElement) {
              console.error("Comment text element not found for comment ID:", commentId);
              return;
            }
            commentTextElement.innerText = updatedText;

           showToast("Comment Updated Successfully","success")
            // Clear the comment input field
            document.getElementById("comment-input1").value = "";
          } catch (error) {
            console.error("Error updating comment:", error);
            showToast("Cannot add comment due to fake api","error")
          }
        });



        modalBody.querySelectorAll(".delete-comment-btn").forEach((button) => {
          button.addEventListener("click", () => {
            const commentId = button.dataset.commentId;

            const modal = document.getElementById("popup-modal");
            modal.classList.remove("hidden");

            const confirmButton = modal.querySelector(
              "[data-modal-hide='popup-modal'][data-confirm-delete]"
            );
            const cancelButton = modal.querySelector(
              "[data-modal-hide='popup-modal'][data-cancel-delete]"
            );

            confirmButton.addEventListener("click", async () => {
              try {
                const response = await fetch(
                  `https://dummyjson.com/comments/${commentId}`,
                  {
                    method: "DELETE",
                  }
                );

                const data = await response.json();

                if (response.ok) {
                  if (data.isDeleted) {
                    button.parentElement.parentElement.parentElement.parentElement.remove();
                    showToast("Comment deleted successfully!","success");
                  } else {
                    showToast("Comment deleted Error","success");
                  }
                } else {
                  showToast("Comment deleted Error!","success");
                }
              } catch (error) {
                console.error("Error deleting comment:", error);
                showToast("Comment deleted Error!","success");
              }

              modal.classList.add("hidden");
            });

            cancelButton.addEventListener("click", () => {
              modal.classList.add("hidden");

            });
          });
        });

        document
          .getElementById("close-modal")
          .addEventListener("click", function () {
            const modal = document.getElementById("popup-modal");
            modal.classList.add("hidden");
          });

      } else {
        modalBody.innerHTML = `
        <div class="my-5 p-2 w-full lg:w-[45%]  h-[450px]">
          <img src="https://source.unsplash.com/random/${postId}" alt="Post Image" class="h-[420px] object-cover w-full" />
        </div>
        <div class="mt-6 text-lg">No comments .</div>
      `;
      }

      modal.classList.remove("hidden");
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }

  document.querySelector(".modal-close").addEventListener("click", () => {
    document.getElementById("commentsModal").classList.add("hidden");
  });

  document.getElementById('username').addEventListener('click', (event) => {
     
    event.preventDefault();
    window.location.href = `?userId=${LoggedInUserData.id}`; 

  });

  document.getElementById('navbarDropdown').addEventListener('click', () => {
    document.getElementById('dropdownMenu').classList.toggle('hidden');
  });

  const signOutButton = document.getElementById('logOut2');
  if (signOutButton) {
    signOutButton.addEventListener("click", (event) => {
      event.preventDefault();
      localStorage.removeItem("users");
      window.location.href = "../Login/login.html";
    });
  }
});
function showToast(message, mode) {
  const toast = document.getElementById('simpleToast'); // Define toast within the function scope
  toast.textContent = message;
  toast.classList.add("show");

  if (mode === "error") {
      toast.classList.add("bg-red-500");
  } else if (mode === "success") {
      toast.classList.add("bg-green-500");
  }

  setTimeout(() => {
      toast.classList.remove("show", "bg-red-500", "bg-green-500");
  }, 3000);
}
function toggleHeart(element) {
  element.querySelector("i").classList.toggle("fa-regular");
  element.querySelector("i").classList.toggle("fa-solid");
}

