import { useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";

export default function LoginOrCreatePost(props) {
    
    // Note! You should use this in combination with sessionStorage.
    // Otherwise, when the user refreshes the page, it will go away!
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const usernameRef = useRef();
    const passwordRef = useRef();
    const commentRef = useRef();
    
    function handleLoginSubmit(e) {
        e?.preventDefault();  // prevents default form submit action
        // TODO: POST to https://cs571api.cs.wisc.edu/rest/f24/ice/login
        fetch("https://cs571api.cs.wisc.edu/rest/f24/ice/login", {
            credentials: "include",
            method: "POST",
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: usernameRef.current.value,
                password: passwordRef.current.value
            })
        })
        .then(res => {
            if (res.status===401){
                alert("Your username or password was incorrect!")
            } else if(res.status === 200) {
                alert("You are successfully logged in!");
                setIsLoggedIn(true);
            }
        })
    }

    function handleCommentSubmit(e) {
        e?.preventDefault(); // prevents default form submit action
        
        // TODO: POST to https://cs571api.cs.wisc.edu/rest/f24/ice/comments
        fetch("https://cs571api.cs.wisc.edu/rest/f24/ice/comments", {
            credentials: "include",
            method: "POST",
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                comment: commentRef.current.value
            })
        })
        .then(res => {
            alert("Your comment has been created!")
            props.refreshComments()
        })
    }

    function handleLogout() {
        // TODO POST to https://cs571api.cs.wisc.edu/rest/f24/ice/logout
        fetch("https://cs571api.cs.wisc.edu/rest/f24/ice/logout", {
            credentials: "include",
            method: "POST",
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
            }
        })
        .then(res => {
            if (res.status===401){
                alert("Your username or password was incorrect!")
            } else if(res.status === 200) {
                alert("You are successfully logged out!");
                setIsLoggedIn(false);
            }
        })
    }

    if (isLoggedIn) {
        return <>
            <Button variant="danger" onClick={handleLogout}>Logout</Button>
            <Form onSubmit={handleCommentSubmit}>
                <Form.Label htmlFor="commentInput">Your Comment</Form.Label>
                <Form.Control id="commentInput" ref={commentRef}></Form.Control>
                <br/>
                <Button type="submit" onClick={handleCommentSubmit}>Post Comment</Button>
            </Form>
        </>
    } else {
        return <Form onSubmit={handleLoginSubmit}>
            <Form.Label htmlFor="usernameInput">Username</Form.Label>
            <Form.Control id="usernameInput" ref={usernameRef}></Form.Control>
            <Form.Label htmlFor="passwordInput">Password</Form.Label>
            <Form.Control id="passwordInput" type="password" ref={passwordRef}></Form.Control>
            <br/>
            <Button type="submit" onClick={handleLoginSubmit}>Login</Button>
        </Form>
    }
}