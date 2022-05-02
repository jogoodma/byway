import { useState } from "react";

const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [count, setCount] = useState(0);
  // setTimeout(() => setComments(prevComments => [...prevComments, 'new comment']), 1000);
  const responses = [
    "The shocks are brand new.",
    "I can't go lower than 800",
    "Sounds good.",
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const comment = e.currentTarget.comment.value;
    e.currentTarget.comment.value = "";
    setComments((prevComments) => [...prevComments, comment]);
    await delay(2000);
    setComments((prevComments) => [...prevComments, responses[count]]);
    setCount((prevCount) => prevCount + 1);
  };

  return (
    <div className="border-2 rounded-lg">
      <h3>Comments:</h3>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul>
          {comments.map((comment, i) => (
            <>
              <li
                key={comment}
                className={
                  i % 2 === 0 ? "text-indigo-900" : "text-slate-800 pl-96"
                }
              >
                <p>{comment}</p>
              </li>
              <hr />
            </>
          ))}
        </ul>
      )}
      <form onSubmit={handleSubmit}>
        <textarea
          name="comment"
          data-theme="light"
          className="m-10 w-5/6 textarea textarea-primary"
          placeholder="Add comment..."
        ></textarea>
        <button type="submit" className="btn btn-primary ml-96">
          Add comment
        </button>
      </form>
    </div>
  );
};

export default Comments;
