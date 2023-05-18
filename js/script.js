alert("Este site é meramente ilustrativo, desenvlvido afins de explorar e evoluir meu conhecimento. https://kaiquezpriv1.github.io/")
const url = "https://jsonplaceholder.typicode.com/posts";

const loadingElement = document.querySelector("#loading")
const postsContainer = document.querySelector("#posts-container");

const postPage = document.querySelector("#post");
const postContainer = document.querySelector("#post-container");
const commentsContainer = document.querySelector("#comments-container");

const commetForm = document.querySelector("#comment-form");
const emailInput = document.querySelector("#email");
const bodyInput = document.querySelector("#body");

// get id from URL
const queryString = window.location.search;
const urlSearchParams = new URLSearchParams(queryString);
const postId = urlSearchParams.get("id");


// get all post
async function getAllPost() {
    //  espera o que a url(api) me retorna
    const response = await fetch(url)
    console.log(response);
    //recebe dados da responsa em formato de array de objetos
    // pega os dados com json
    const data = await response.json();
    console.log(data);

    loadingElement.classList.add("hide");
    // recebe os comentarios da api
    data.map((post) => {
        const div = document.createElement("div");
        div.classList.add("box")
        const img = document.createElement("img");
        const title = document.createElement("h2");
        const body = document.createElement("p");
        const link = document.createElement("a");

        img.src = "./js/dog-jump.svg";
        title.innerText = post.title;
        body.innerText = post.body;
        link.innerText = "Ler"
        link.setAttribute("href", `/post.html?id=${post.id}`);

        div.appendChild(img)
        div.appendChild(title);
        div.appendChild(body);
        div.appendChild(link);

        postsContainer.appendChild(div);
    });
}

//get individual post
async function getPost(id) {
    const [responsePost, responseComments] = await Promise.all([
        fetch(`${url}/${id}`),
        fetch(`${url}/${id}/comments`)
    ]);
    
    const dataPost = await responsePost.json();
    const dataComments = await responseComments.json();

    loadingElement.classList.add("hide");
    postPage.classList.remove("hide");

    const title = document.createElement("h1")
    const body = document.createElement("p")

    title.innerText = dataPost.title;
    body.innerText = dataPost.body;

    postContainer.appendChild(title);
    postContainer.appendChild(body);

    dataComments.map((commet) => {
        createComment(commet);
    });
}

// criando escopo da div que vai receber comentario e e-mail
function createComment(commet) {
    const div = document.createElement("div")
    const email = document.createElement("h3")
    const commetBody = document.createElement("p")

    email.innerText = commet.email;
    commetBody.innerText = commet.body;

    div.appendChild(email);
    div.appendChild(commetBody);

    commentsContainer.appendChild(div);
}

// Post a comment
async function postComment(comment) {
    const response = await fetch(`${url}/${postId}/comments`, {
        method: "POST",
        body: comment,
        headers: {
            "Content-type": "application/json",
        },
    });

    const data = await response.json();

    createComment(data);
}

if(!postId) {
    getAllPost();
} else {
    getPost(postId);

    // add event to commets form
    commetForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let comment = {
            email: emailInput.value,
            body: bodyInput.value,
        };
        comment = JSON.stringify(comment);
        postComment(comment);
    })
}