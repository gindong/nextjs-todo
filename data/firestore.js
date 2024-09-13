// Import the functions you need from the SDKs you need
import exp from "constants";
import { initializeApp } from "firebase/app";
import {
   getFirestore, collection, getDocs, doc, setDoc, getDoc, deleteDoc, updateDoc, Timestamp, query, orderBy, limit

 } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FB_API_KEY,
  authDomain: process.env.FB_AUTH_DOMAIN,
  projectId: process.env.FB_PROJECT_ID,
  storageBucket: process.env.FB_STORAGE_BUCKET,
  messagingSenderId: process.env.FB_MESSAGING_SENDERID,
  appId: process.env.FB_APP_ID
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//모든 할일 가져오기
export async function fetchTodos() {


  const todosRef = collection(db,"todos");

  const q = query(todosRef, orderBy("create_at", "desc"), limit(10));

  const querySnapshot = await getDocs(q);

  if(querySnapshot.empty) {
    return [];
  }
  //console.log(querySnapshot);
  const fetchedTodos = [];
  querySnapshot.forEach((doc) => {
    //console.log(doc.id, "=>", doc.data());
    const aTodo = {
      id: doc.id,
      title: doc.data()["title"],
      is_done: doc.data()["is_done"],
      create_at: doc.data()["create_at"].toDate()
      //.toLocaleTimeString('ko')
    }
    fetchedTodos.push(aTodo);
  });

  return fetchedTodos;

}

//할일 추가
export async function addTodo({title}) {

  const newRef = doc(collection(db,"todos"));

  const createAt = Timestamp.fromDate(new Date());

  const newTodoData = {
    id: newRef,
    title: title,
    is_done: false,
    create_at: createAt 
  }
  await setDoc(newRef,newTodoData);

  return {
    id: newRef,
    title: title,
    is_done: false,
    create_at: createAt.toDate() 
  };
}

//할일 조회
export async function fetchTodo(id) {

  if(id===null) return null;

  const todoRef = doc(db, "todos", id);
  const todoDocSnap = await getDoc(todoRef);
  
  if (todoDocSnap.exists()) {
    const fetchedTodo = {
      id: todoDocSnap.id,
      title: todoDocSnap.data()["title"],
      is_done: todoDocSnap.data()["is_done"],
      create_at: todoDocSnap.data()["create_at"].toDate()

    }
    return fetchedTodo;

  } else {
    return null;
  }
}

//할일 삭제
export async function deleteTodo(id) {

  if(id===null) return null;

  const one = await fetchTodo(id);

  if(one === null) {return null;}

  await deleteDoc(doc(db,"todos",id));

  return one;
 
}

//할일 수정
export async function modifyTodo(id, {title, is_done}) {

  if(id===null) return null;

  const one = await fetchTodo(id);

  if(one === null) {return null;}

  const todoRef = doc(db,"todos",id);

  await updateDoc(todoRef,
    {
      title: title,
      is_done: is_done
    }
  );

  return {id:id,title:title,is_done:is_done,create_at:one.create_at};
 
}


module.exports = { fetchTodos, addTodo, fetchTodo, deleteTodo, modifyTodo }