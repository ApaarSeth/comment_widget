var {fromEvent, of, Observable, Subject, ReplaySubject} = rxjs;
var commentsArr = [];
let commentList = document.getElementsByClassName("commentList")[0];
let addComment = document.getElementsByClassName("addComment")[0];
let inputComment = document.getElementsByClassName("comment")[0];
let addChild = document.getElementById("addChild");
let checkDebounce = document.getElementsByClassName("checkDebounce")[0];

class Comments {
  constructor(parentId, id, comment, author, children) {
    this.parentId = parentId;
    this.id = id;
    this.comment = comment;
    this.author = author;
    this.children = children;
  }
}

(function () {
  commentsArr = JSON.parse(localStorage.getItem("commentsArr"));
  commentsArr = commentsArr ? commentsArr : [];
  if(commentsArr.length)
  commentList.innerHTML+=generateComments(commentsArr);
})();

function deleteElement(id) {
  let ele = document.getElementById("child-" + id);
  document.getElementById("child-" + id).remove();
}

function findElement(idList,array){
  for (let id of idList) {
    for (let comment of array) {
      if (comment.id === id) {
        array = comment.children.length? comment.children:comment;
        break;
      }
    }
  } 
  return array;
}

addComment.addEventListener("click", function (event) {
  let length = commentsArr.length;
  let addedComment = new Comments(null,length.toString(),inputComment.value, "jinka", []);
  commentsArr.push(addedComment); 
  localStorage.setItem("commentsArr", JSON.stringify(commentsArr));
  commentList.innerHTML += getComment(addedComment);
}); 

commentList.addEventListener("click", function (event) {
  if (event.target.id.includes("addChild")) {
    let value = document.getElementsByClassName("addChildInput")[0].value;
    let parentId=event.target.id.slice(event.target.id.indexOf("-") + 1);
    let comment=new Comments(parentId,Math.random(2).toString(),value,"jinka",[])
    let array = commentsArr;
    let idList=event.target.id.slice(event.target.id.indexOf("-") + 1).split("/");
    array=findElement(idList,array);
    array.children.push(comment);
    commentList.innerHTML="<ul>"+generateComments(commentsArr)+"</ul>";
    localStorage.setItem("commentsArr", JSON.stringify(commentsArr));
  } else if (event.target.id.includes("reply")) {
    document.getElementById(event.target.id).parentElement.innerHTML += `<div class="childInputWrapper"><input class="addChildInput" type="text" placeholder="Add Comment..." />
    <button class="addChild" id="addChild-${event.target.id.slice(event.target.id.indexOf("-") + 1)}">Add</button></div>`;
  } else if (event.target.id.includes("delete")) {
    let idList=event.target.id.slice(event.target.id.indexOf("-") + 1).split("/");
    filterArray(idList);
  }
});

function filterArray(ids) {
  let array = commentsArr;
  for (let i = 0; i < ids.length; i++) {
    if (i != ids.length - 1) {
      for (let comment of array) {
        if (comment.id === ids[i]) {
          array = comment.children;
          break;
        }
      }
    } else {
      let index = null;
      for (let [arrIndex, arr] of array.entries()) {
        if (arr.id === ids[i]) {
          index = arrIndex;
          break;
        }
      }
      array.splice(index, 1);
    }
  }
  commentList.innerHTML="<ul>"+generateComments(commentsArr)+"</ul>";
  localStorage.setItem("commentsArr", JSON.stringify(commentsArr));
}

function getComment(comment){
  let id=comment.parentId ? `${comment.parentId}/${comment.id}` : `${comment.id}`;
  return `<li id="${id}"
  <div>${comment.comment}</div>
  <div><button id="reply-${id}">reply</button></div>
  <div><button id="delete-${id}">delete</button></div>
  </li>`
}

function generateComments(commentsArr){
  let liList=""
  for (let [i, comment] of commentsArr.entries()) {
    let li =getComment(comment);
    commentList.innerHTML += li;
    if (comment.children.length) {
      let childCommentList = `<ul>${generateComments(comment.children)}</ul>`;
      li = li.split("</li>")[0] + childCommentList + "</li>";
    }
    liList+= li;
  }
  return liList 
}
