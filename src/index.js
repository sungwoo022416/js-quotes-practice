const URL = "http://localhost:3000/quotes";
const likeURL = "http://localhost:3000/likes";

const quoteList = document.querySelector("#quote-list");
const newForm = document.querySelector("#new-quote-form");

fetch(likeURL)
.then(res => res.json())
.then(quotesLikes => {

        fetch(URL)
        .then(res => res.json())
        .then(quotesArray => {
                quotesArray.forEach(quotes => {renderQuotes(quotes, quotesLikes)});
        });
    }); 

function renderQuotes(quotesObj, likesArray) {
    let li = document.createElement("li");
    li.dataset.id = quotesObj.id;
    li.classList.add("quote-card");

    li.innerHTML = `<blockquote class="blockquote">
    <p class="mb-0">${quotesObj.quote}</p>
    <footer class="blockquote-footer">${quotesObj.author}</footer>
    <br>
  </blockquote>`;

    let matchingLike = likesArray.filter(likes => likes.quoteId == li.dataset.id);
    
    let blockQuote = li.querySelector(".blockquote");

    let likeBtn = document.createElement("button");
    likeBtn.classList.add('btn-success');
    likeBtn.style.color = "green";
    likeBtn.textContent = `Likes: ${matchingLike.length}`;

  let deleteBtn = document.createElement("button");
  deleteBtn.classList.add('btn-danger');
  deleteBtn.textContent = "Delete";


  likeBtn.addEventListener("click", event => {
        event.preventDefault();
    
        const quoteId = li.dataset.id;
        
        const newLike = {
            quoteId
        }

        const configObj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newLike)
        };

        fetch(likeURL, configObj)
        .then(res => res.json())
        .then(obj => {
            likesArray.push(obj);
            let matching = likesArray.filter(likes => likes.quoteId == li.dataset.id)
            likeBtn.textContent = `Likes: ${matching.length}`;
        })
    })


  deleteBtn.addEventListener("click", event => {
      event.preventDefault();
    
      const id = li.dataset.id;
      deleteQuote(id)

      li.remove();
  })

  blockQuote.appendChild(likeBtn);
  blockQuote.appendChild(deleteBtn);
  quoteList.appendChild(li);

}

function deleteQuote(id) {
    fetch(URL + `/${id}`, {
        method: "DELETE"
    })

}

    newForm.addEventListener("submit", event => {
        event.preventDefault();

        createNewQuote(event);
    })

function createNewQuote(event) {
    const quote = event.target.quote.value;
    const author = event.target.author.value;

    const newQuote = {
        quote,
        author
    }

    const configObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newQuote)
    };

    fetch(URL, configObj)
    .then(res => res.json())
    .then(obj => renderQuotes(obj));
}
