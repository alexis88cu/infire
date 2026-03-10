'use client';

import { useState, useEffect } from 'react';

interface Comment {
  id: string;
  name: string;
  text: string;
  date: string;
}

export default function BlogInteractions({ slug }: { slug: string }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [views, setViews] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const likeKey = `infire_like_${slug}`;
    const viewKey = `infire_views_${slug}`;
    const commentKey = `infire_comments_${slug}`;

    // Views: increment once per session, multiply x3 for display
    const sessionKey = `infire_viewed_${slug}`;
    const rawViews = parseInt(localStorage.getItem(viewKey) || '0');
    if (!sessionStorage.getItem(sessionKey)) {
      const newRaw = rawViews + 1;
      localStorage.setItem(viewKey, String(newRaw));
      sessionStorage.setItem(sessionKey, '1');
      setViews(newRaw * 3);
    } else {
      setViews(rawViews * 3);
    }

    // Likes
    const savedLike = localStorage.getItem(likeKey) === '1';
    const savedLikeCount = parseInt(localStorage.getItem(`${likeKey}_count`) || String(Math.floor(Math.random() * 40) + 12));
    setLiked(savedLike);
    setLikeCount(savedLikeCount);
    if (!localStorage.getItem(`${likeKey}_count`)) {
      localStorage.setItem(`${likeKey}_count`, String(savedLikeCount));
    }

    // Comments
    try {
      const saved = JSON.parse(localStorage.getItem(commentKey) || '[]');
      setComments(saved);
    } catch { setComments([]); }
  }, [slug]);

  const handleLike = () => {
    const likeKey = `infire_like_${slug}`;
    const countKey = `${likeKey}_count`;
    const newLiked = !liked;
    const newCount = newLiked ? likeCount + 1 : likeCount - 1;
    setLiked(newLiked);
    setLikeCount(newCount);
    localStorage.setItem(likeKey, newLiked ? '1' : '0');
    localStorage.setItem(countKey, String(newCount));
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    const newComment: Comment = {
      id: Date.now().toString(),
      name: name.trim(),
      text: text.trim(),
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    };
    const updated = [...comments, newComment];
    setComments(updated);
    localStorage.setItem(`infire_comments_${slug}`, JSON.stringify(updated));
    setName('');
    setText('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  if (!mounted) return null;

  return (
    <div>
      {/* Views + Like bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '1.5rem',
        padding: '1rem 1.25rem',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        marginBottom: '3rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gray)', fontSize: '0.85rem' }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
          </svg>
          <span>{views.toLocaleString()} views</span>
        </div>
        <div style={{ width: '1px', height: '16px', background: 'var(--border)' }}/>
        <button
          onClick={handleLike}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            background: 'none', border: 'none', cursor: 'pointer',
            color: liked ? '#e05c5c' : 'var(--gray)',
            fontSize: '0.85rem', padding: '0',
            transition: 'color 0.15s',
          }}
        >
          <span style={{ fontSize: '1.1rem', transition: 'transform 0.15s', transform: liked ? 'scale(1.25)' : 'scale(1)' }}>
            {liked ? '❤️' : '🤍'}
          </span>
          <span>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
        </button>
        <div style={{ marginLeft: 'auto' }}>
          <a
            href="/subscribe"
            style={{
              fontSize: '0.78rem', color: 'var(--orange)',
              textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem',
            }}
          >
            <span>🔔</span> Subscribe for more
          </a>
        </div>
      </div>

      {/* Comments Section */}
      <div style={{ marginBottom: '4rem' }}>
        <h3 style={{
          fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.75rem',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
        }}>
          💬 Comments
          {comments.length > 0 && (
            <span style={{
              background: 'var(--orange)', color: '#fff',
              borderRadius: '99px', padding: '0.1rem 0.55rem',
              fontSize: '0.72rem', fontWeight: 700,
            }}>{comments.length}</span>
          )}
        </h3>

        {/* Existing comments */}
        {comments.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {comments.map(c => (
              <div key={c.id} style={{
                padding: '1rem 1.25rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: 'var(--orange)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, color: '#fff', flexShrink: 0,
                  }}>
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{c.name}</div>
                    <div style={{ color: 'var(--gray)', fontSize: '0.75rem' }}>{c.date}</div>
                  </div>
                </div>
                <p style={{ color: '#adb5bd', fontSize: '0.88rem', lineHeight: 1.7, margin: 0, paddingLeft: '44px' }}>{c.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--gray)', fontSize: '0.88rem', marginBottom: '1.5rem', fontStyle: 'italic' }}>
            No comments yet. Be the first to share your thoughts.
          </p>
        )}

        {/* Comment form */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          padding: '1.5rem',
        }}>
          <h4 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.25rem', marginTop: 0 }}>Leave a Comment</h4>
          {submitted && (
            <div style={{
              background: 'rgba(40,167,69,0.12)', border: '1px solid rgba(40,167,69,0.3)',
              borderRadius: '6px', padding: '0.75rem 1rem',
              color: '#6fcf97', fontSize: '0.85rem', marginBottom: '1rem',
            }}>
              ✓ Comment posted. Thank you!
            </div>
          )}
          <form onSubmit={handleComment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
                borderRadius: '6px', padding: '0.7rem 1rem',
                color: '#e6edf3', fontSize: '0.9rem', outline: 'none',
              }}
            />
            <textarea
              placeholder="Share your thoughts, questions, or field experience..."
              value={text}
              onChange={e => setText(e.target.value)}
              required
              rows={4}
              style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
                borderRadius: '6px', padding: '0.7rem 1rem',
                color: '#e6edf3', fontSize: '0.9rem', outline: 'none',
                resize: 'vertical', fontFamily: 'inherit',
              }}
            />
            <div>
              <button
                type="submit"
                style={{
                  background: 'var(--orange)', color: '#fff',
                  border: 'none', borderRadius: '6px',
                  padding: '0.7rem 1.5rem', fontWeight: 700,
                  fontSize: '0.88rem', cursor: 'pointer',
                }}
              >
                Post Comment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
