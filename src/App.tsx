import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>No Brand Blog</h1>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </nav>
      </header>
      <main>
        <section className="blog-posts">
          <article className="blog-post">
            <h2>Welcome to My Blog</h2>
            <p className="post-meta">Posted on April 13, 2024</p>
            <p>
              Welcome to my new blog! This is built with React and hosted on GitHub Pages.
              I'll be sharing my thoughts and experiences here.
            </p>
          </article>
        </section>
      </main>
      <footer>
        <p>&copy; 2024 No Brand Blog. Built with React.</p>
      </footer>
    </div>
  );
}

export default App;
