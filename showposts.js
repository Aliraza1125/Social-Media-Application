let skip = 0;
const limit = 10;
let loadedPosts = 0;

async function fetchPostsAndDisplay(searchQuery = "") {
  const postContainer = document.getElementById("mainTimeline");

  let apiUrl = `https://dummyjson.com/posts?limit=${limit}&skip=${skip}&select=title,reactions,userId,body,tags`;

  if (searchQuery) {
    apiUrl = `https://dummyjson.com/posts/search?q=${searchQuery}`;
    postContainer.innerHTML = "";
    loadedPosts = 0;

    // Add the search info div at the top
    const searchInfoDiv = document.createElement("div");
    searchInfoDiv.classList.add(
      "p-2",
      "bg-white",
      "rounded-[15px]",
      "h-12",
      "dflex",
      "items-center"
    );
    searchInfoDiv.innerHTML = `<span id="searchFor" class="font-semibold text-black">Search For: ${searchQuery}</span>`;
    postContainer.appendChild(searchInfoDiv);
  }
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      let posts = Array.isArray(data) ? data : data && data.posts;
      console.log("Posts", posts);

      if (posts) {
        posts.forEach((post) => {
          if (post.userId) {
            fetch(`https://dummyjson.com/users/${post.userId}`)
              .then((response) => response.json())
              .then((user) => {
                console.log(user);
                const newPost = document.createElement("div");
                newPost.classList.add(
                  "w-full",
                  "p-3",
                  "bg-white",
                  "rounded-[10px]"
                );
                // Fetch comments for the post
                fetch(`https://dummyjson.com/comments/post/${post.id}`)
                  .then((response) => response.json())
                  .then((comments) => {
                    console.log("fsdss", comments);
                    let numComments = comments.total;
                    console.log(numComments);

                    newPost.innerHTML = `
                    <div class="flex items-center justify-between w-full">
                      <div class="flex justify-between items-center gap-3">
                        <div class="w-[60px] h-[60px] border-red border-2 rounded-full overflow-hidden">
                          <img src="${user.image
                      }" alt="User Avatar" class="w-full h-full object-cover p-0.5 border-red  border-2 rounded-full" />
                        </div>
                        <div class="">
                        <a href="./userProfile/profile.html?userId=${user.id}">
                          <h1 class="cursor-pointer text-sm font-semibold text-[#262626] hover:text-[#c7c7c7]" onclick="profile.html?userId=${user.id
                      }">${user.username}</h1>

                          </a>
                          <span class="text-sm">${user.address.address} , ${user.address.city
                      }</span>
                        </div>
                      </div>
                      <div class="cursor-pointer mr-4">
                        <i class="fa-solid fa-ellipsis"></i>
                      </div>
                    </div>
                
                    <div class="my-5 p-2">
                     <img src="https://source.unsplash.com/random/${post.id
                      }" alt="Post Image" class="h-[450px] object-cover w-full rounded-lg " />
                    </div>
                    <div class="flex justify-between items-center my-4 mx-3">
                      <div class="flex gap-5">
                        <div class="cursor-pointer text-xl" onclick="toggleHeart(this)" >
                          <i class="fa-regular fa-heart"></i>
                        </div>
                        <button class="cursor-pointer text-xl" onclick="scrollToCommentInput(this)">
                        <i class="fa-regular fa-comment" ></i>
                        </button>
                        <div class="cursor-pointer text-xl">
                          <i class="fa-regular fa-share-from-square"></i>
                        </div>
                      </div>
                      <div class="flex text-xl cursor-pointer">
                        <span><i class="fa-regular fa-bookmark"></i></span>
                      </div>
                    </div>
                    <span class="mx-2">Liked by <span class="font-semibold">${user.username
                      } </span> and ${post.reactions} others</span>
                    <div class="my-2 mx-2">
                    <a href="./userProfile/profile.html?userId=${user.id}">
                    <span class="cursor-pointer text-sm font-semibold text-[#262626] hover:text-[#c7c7c7]"> ${user.username
                      }  </span>
                      </a>
                     <span class="text-[#000000] "> ${post.body}  </span>
                    </div>  
                    <div class="my-2 mx-2">
                    <span class="text-[#00376b] cursor-pointer"> ${post.tags
                        .map((tag) => `#${tag}`)
                        .join(", ")} </span>
                   </div>
                   <div id="seeComments" class="mx-2 my-2">
                   <span class="cursor-pointer text-[#737373] hover:text-[#c7c7c7]"> View all ${numComments > 1 ? numComments : ""
                      } Comments</span>
                         
                 </div>
                 <div id="loading" class="flex justify-center items-center w-full ml-12" style="display: none;">
                 <img src="./assets/loader.gif" alt="" class="w-8">
             </div>
                 <div class="comment-layout mx-2 my-4 flex justify-between items-center">
                 <input id="comment-input" type="text" placeholder="Add a comment..." class="comment-input w-full focus:outline-none text-[#737373]">
                    
                 <div id="addComment" class="flex items-center gap-3">

             <span id="post-text" class="cursor-pointer text-[#0064e0] hidden hover:text-[#0065e07e]">Post</span>
              <span class="cursor-pointer"><i class="fa-regular fa-face-smile text-[#737373] hover:text-[#c7c7c7]"></i></span>
            </div>
     
               </div>
               <div class="mx-2 my-4 text-[#737373]">
                 <hr style="border-top: 1px solid #737373;">
             </div>
       

                  `;
                    postContainer.appendChild(newPost);

                    loadedPosts++;

                    // Add "Show More" button after every 10 posts
                    if (!searchQuery) {
                      if (loadedPosts % limit === 0) {

                        const showMoreContainer = document.createElement("div");
                        showMoreContainer.classList.add(
                          "w-full",
                          "p-3",
                          "rounded-lg",
                          "mb-[10px]"
                        );

                        const showMoreBtn = document.createElement("button");
                        showMoreBtn.textContent = "Show More";
                        showMoreBtn.classList.add(
                          "bg-white",
                          "hover:bg-gray-100",
                          "text-gray-800",
                          "font-semibold",
                          "py-2",
                          "px-4",
                          "border",
                          "border-gray-400",
                          "rounded",
                          "shadow",
                          "ml-auto"
                        );
                        showMoreBtn.addEventListener("click", () => {
                          const loadingDiv = document.createElement("div");
                          loadingDiv.id = "loading";
                          loadingDiv.classList.add("flex", "items-center", "justify-center", "w-full");
                          loadingDiv.innerHTML = '<img src="assets/loader.gif" alt="" class="w-8">';
              
                          showMoreContainer.innerHTML = ""; 
                          showMoreContainer.appendChild(loadingDiv); 
              
                          setTimeout(() => {
                              skip += limit;
                              fetchPostsAndDisplay();
                              showMoreContainer.remove();
                          }, 3000); 
                      });          


                        showMoreContainer.appendChild(showMoreBtn);
                        postContainer.appendChild(showMoreContainer);
                      }
                    }

                    const inputField = newPost.querySelector("#comment-input");
                    const postText = newPost.querySelector("#post-text");
                    if (inputField && postText) {
                      inputField.addEventListener("input", function () {
                        if (this.value.trim().length > 0) {
                          postText.classList.remove("hidden");
                        } else {
                          postText.classList.add("hidden");
                        }
                      });
                    }

                    const seeCommentsElement = newPost.querySelector("#seeComments");
                    const loadingElement = newPost.querySelector("#loading");
                    if (seeCommentsElement) {
                      seeCommentsElement.addEventListener("click", () => {
                    
                           loadingElement.style.display = "block";
            
                            setTimeout(() => {
                              fetchAndDisplayComments(post.id);
                              loadingElement.style.display = "none";
                          }, 1500); 
                      });
                  
                    }

                    const postButton = newPost.querySelector("#post-text");
                    const usersData = JSON.parse(localStorage.getItem("users"));

                    if (postButton) {
                      postButton.addEventListener("click", () => {
                        let commentInput =
                          newPost.querySelector("#comment-input");
                        let commentBody = commentInput.value.trim();
                        let userId = usersData ? usersData.id : null;
                        if (commentBody !== "") {
                          addComment(post.id, userId, commentBody);

                          commentInput.value = "";
                        }
                      });
                    }
                  })
                  .catch((error) => {
                    console.error("Error fetching comments:", error);
                  });
              })
              .catch((error) => {
                console.error("Error fetching user data:", error);
              });
          } else {
            console.error("User ID is undefined for post:", post);
          }
        });
      } else {
        console.error("No posts found in the response");
      }
    })
    .catch((error) => {
      console.error("Error fetching posts:", error);
    });
}

// Function to add comment
function addComment(postId, userId, commentBody) {
  fetch("https://dummyjson.com/comments/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      body: commentBody,
      postId: postId,
      userId: userId,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      localStorage.setItem("commentResponse", JSON.stringify(data));
      simpleToast("✅ Comment Added Successfully", "success");
      fetchAndDisplayComments(postId, commentBody);
    })
    .catch((error) => {
      simpleToast("Error adding comment", "error");
      console.error("Error adding comment:", error);
    });
}
function scrollToCommentInput(button) {
  const commentInput = button
    .closest(".w-full")
    .querySelector(".comment-input");
  if (commentInput) {
    commentInput.focus();
  }
}

async function fetchAndDisplayComments(postId, commentBody = "") {
  try {
    let userData = JSON.parse(localStorage.getItem("users"));
    let loggedInUserId = userData.id;

    let newComment = {
      id: 341,
      body: commentBody,
      postId: postId,
      user: {
        id: JSON.parse(localStorage.getItem("users")).id,
        username: JSON.parse(localStorage.getItem("users")).username,
      },
    };

   

    // Fetch post details
    const postRes = await fetch(`https://dummyjson.com/posts/${postId}`);
    const postData = await postRes.json();
    const postUserId = postData.userId;
 

    const res = await fetch(`https://dummyjson.com/comments/post/${postId}`);
    const data = await res.json();
    const comments = data.comments;
   

    if (commentBody != "") {
      comments.push(newComment);
    }

    const modal = document.getElementById("commentsModal");
    const modalBody = modal.querySelector(".modal-body");
    modalBody.innerHTML = "";

    if (Array.isArray(comments) && comments.length > 0) {
      modalBody.innerHTML += `
        <div class="my-5 p-2 w-full lg:w-[45%]  h-[450px]">
          <img src="https://source.unsplash.com/random/${postId}" alt="Post Image" class="h-[420px] object-cover w-full" />
        </div>
      `;

      const parentDiv = document.createElement("div");
      parentDiv.classList.add(
        "parent-div",
        "flex",
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
              <img src="${user.image
            }" alt="User Avatar" class="w-full h-full object-cover p-1 border-blue border-2 rounded-full" />
            </div>
            <div class="flex justify-between w-full mt-[10px]">
              <div class="flex gap-2 items-start ">
                <div>
                <a href="../userProfile/profile.html?userId=${user.id}">
                  <span class="cursor-pointer text-sm font-semibold text-[#262626] hover:text-[#c7c7c7]">${comment.user.username
            }</span>
            </a>
                </div>
                <div>
                  <span class="commentBody text-[#000000]  text-[16px] text-justify" id="commentbody">${comment.body
            }</span>
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

      parentDiv.appendChild(inputField);

      modalBody.appendChild(parentDiv);

      // Variable to store the clicked edit button
      let clickedEditButton;

      // Event listener for editing comments
      document.querySelectorAll(".edit-comment-btn").forEach((button) => {
        button.addEventListener("click", () => {
          console.log("Edit button clicked");
          const commentContainer = button.closest("#singlecomment");
          const commentTextElement =
            commentContainer.querySelector(".commentBody");

          if (!commentTextElement) {
            console.error("Comment text element not found.");
            return;
          }

          const commentText = commentTextElement.innerText;

          // Populate comment input field with existing comment text
          const commentInput = document.getElementById("comment-input1");
          commentInput.value = commentText;

          // Store a reference to the clicked edit button
          clickedEditButton = button;

          // Store the comment ID in a data attribute for the "Post" button
          const postBtn = document.getElementById("post-text1");
          postBtn.dataset.commentId = button.dataset.commentId;
          console.log("Comment ID:", postBtn.dataset.commentId);
        });
      });

      // Event listener for posting edited comments
      const postBtn = document.getElementById("post-text1");
   
      postBtn.addEventListener("click", async () => {
        const commentId = postBtn.dataset.commentId;
      
        const updatedText = document.getElementById("comment-input1").value;
   

        try {
          const response = await fetch(
            `https://dummyjson.com/comments/${commentId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                body: updatedText,
              }),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to update comment");
          }
          const commentContainer = clickedEditButton.closest("#singlecomment");
          const commentTextElement =
            commentContainer.querySelector(".commentBody");

          if (!commentTextElement) {
            console.error(
              "Comment text element not found for comment ID:",
              commentId
            );
            return;
          }
          commentTextElement.innerText = updatedText;
          document.getElementById("comment-input1").value = "";
          simpleToast("✅ Comment Updated Successfully", "success");
        } catch (error) {
          simpleToast("You Can't Update Due to Fake Api", "error");
          document.getElementById("comment-input1").value = "";
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
              simpleToast("✅ Comment Deleted Successfully", "success");
                } else {
                  simpleToast("You Can't Delete Comment Due to Fake Api.","error");
                }
              } else {
                simpleToast("You Can't Delete Comment Due to Fake Api.","error");
              }
            } catch (error) {
              console.error("Error deleting comment:", error);
              simpleToast("You Can't Delete Comment Due to Fake Api.","error");
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
      <div class="mt-6 text-lg">No comments...</div>
    `;
    }

    modal.classList.remove("hidden");
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
}

function toggleHeart(element) {
  element.querySelector("i").classList.toggle("fa-regular");
  element.querySelector("i").classList.toggle("fa-solid");
}

document.querySelector(".modal-close").addEventListener("click", () => {
  document.getElementById("commentsModal").classList.add("hidden");
});

fetchPostsAndDisplay();

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener(
  "keyup",
  debounce(function () {
    console.log("Search input");
    const searchQuery = this.value.trim();
    console.log("searchQuery", searchQuery);
    if (searchQuery == "") {
      fetchPostsAndDisplay();
    } else {
      fetchPostsAndDisplay(searchQuery);
    }
  }, 500)
);

function simpleToast(message, mode) {
  var x = document.getElementById("simpleToast");


  if (mode === "error") {
    x.classList.add("bg-red-500");
  } else if (mode === "success") {
    x.classList.add("bg-green-500");
  }

  x.classList.add("show");
  x.innerText = message;

  setTimeout(function () {
    x.classList.remove("show");
    x.classList.remove("bg-red-500");
    x.classList.remove("bg-green-500");
  }, 4000);
}
