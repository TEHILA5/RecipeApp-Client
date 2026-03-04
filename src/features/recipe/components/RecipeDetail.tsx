// ===============================================
// RecipeDetail Component - Sweet&Treat
// ===============================================
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { deleteExistingRecipe } from '../redux/recipeSlice';
import * as userActionApi from '../../../api/userActionApi';
import type { Recipe } from '../types/recipe.types';
import type { UserActionDto, CommentCreateDto } from '../types/userAction.types';
import { LEVEL_LABELS, CATEGORY_EMOJIS } from '../types/recipe.types';

interface RecipeDetailProps {
  recipe: Recipe;
}

export default function RecipeDetail({ recipe }: RecipeDetailProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAdmin, user } = useAppSelector((state) => state.auth);
  const isLoggedIn = !!user;

  const [comments, setComments] = useState<UserActionDto[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [deletingRecipe, setDeletingRecipe] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [commentForm, setCommentForm] = useState({ content: '', rating: 5 });
  const [commentError, setCommentError] = useState('');
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions' | 'comments'>('ingredients');

  const emoji = CATEGORY_EMOJIS[recipe.category] ?? '🍰';
  const levelLabel = LEVEL_LABELS[recipe.level as 1 | 2 | 3] ?? 'Easy';

  // Load comments & check bookmark on mount
  useEffect(() => {
    loadComments();
    if (isLoggedIn) {
      checkBookmarkStatus();
      recordHistory();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipe.id, isLoggedIn]);

  const loadComments = async () => {
    setLoadingComments(true);
    try {
      const data = await userActionApi.getRecipeComments(recipe.id);
      setComments(data);
    } catch {
      // fail silently
    } finally {
      setLoadingComments(false);
    }
  };

  const checkBookmarkStatus = async () => {
    try {
      const actions = await userActionApi.getUserActionsByType('Book');
      setIsBookmarked(actions.some((a) => a.recipeId === recipe.id));
    } catch {
      // fail silently
    }
  };

  const recordHistory = async () => {
    try {
      await userActionApi.addHistory({ category: recipe.category });
    } catch {
      // fail silently
    }
  };

  const handleBookmark = async () => {
    if (!isLoggedIn) { navigate('/login'); return; }
    setBookmarkLoading(true);
    try {
      if (isBookmarked) {
        await userActionApi.removeBookmark(recipe.id);
        setIsBookmarked(false);
      } else {
        await userActionApi.addBookmark(recipe.id);
        setIsBookmarked(true);
      }
    } catch {
      // fail silently
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!isLoggedIn) { navigate('/login'); return; }
    if (!commentForm.content.trim()) {
      setCommentError('Please write a comment');
      return;
    }
    setCommentError('');
    setSubmittingComment(true);
    try {
      const dto: CommentCreateDto = {
        recipeId: recipe.id,
        content: commentForm.content.trim(),
        rating: commentForm.rating,
      };
      await userActionApi.addComment(dto);
      setCommentForm({ content: '', rating: 5 });
      await loadComments();
    } catch (err: unknown) {
      setCommentError(err instanceof Error ? err.message : 'Failed to submit comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDelete = async () => {
    setDeletingRecipe(true);
    try {
      await dispatch(deleteExistingRecipe(recipe.id)).unwrap();
      navigate('/recipes');
    } catch {
      setDeletingRecipe(false);
      setShowDeleteConfirm(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onChange?: (r: number) => void) => (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => interactive && onChange?.(star)}
          style={{
            fontSize: interactive ? '1.6rem' : '1rem',
            cursor: interactive ? 'pointer' : 'default',
            color: star <= rating ? '#f59e0b' : '#d1d5db',
            transition: 'color 0.15s',
          }}
        >
          ★
        </span>
      ))}
    </div>
  );

  const levelColors: Record<number, string> = {
    1: '#22c55e',
    2: '#f59e0b',
    3: '#ef4444',
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px', fontFamily: "'Nunito', sans-serif" }}>

      {/* ── Hero Section ── */}
      <div style={{
        borderRadius: '28px',
        overflow: 'hidden',
        boxShadow: '0 8px 40px rgba(212,84,122,0.15)',
        marginBottom: '32px',
        position: 'relative',
        background: 'white',
      }}>
        {/* Image or Emoji */}
        <div style={{ position: 'relative', aspectRatio: '16/7', background: 'linear-gradient(135deg,#f9e4ec,#e8c49a)', overflow: 'hidden' }}>
          {recipe.arrImage ? (
            <img src={recipe.arrImage} alt={recipe.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '100px' }}>
              {emoji}
            </div>
          )}
          {/* Overlay gradient */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)' }} />

          {/* Admin Buttons */}
          {isAdmin && (
            <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px' }}>
              <button
                onClick={() => navigate(`/recipes/${recipe.id}/edit`)}
                style={{
                  padding: '8px 20px', borderRadius: '999px', border: 'none',
                  background: 'rgba(255,255,255,0.95)', color: '#d4547a',
                  fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '0.85rem',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                }}
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                style={{
                  padding: '8px 20px', borderRadius: '999px', border: 'none',
                  background: 'rgba(239,68,68,0.9)', color: 'white',
                  fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '0.85rem',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                }}
              >
                🗑️ Delete
              </button>
            </div>
          )}

          {/* Bookmark Button */}
          <button
            onClick={handleBookmark}
            disabled={bookmarkLoading}
            style={{
              position: 'absolute', top: '16px', left: '16px',
              width: '44px', height: '44px', borderRadius: '50%', border: 'none',
              background: isBookmarked ? '#d4547a' : 'rgba(255,255,255,0.9)',
              color: isBookmarked ? 'white' : '#d4547a',
              fontSize: '1.3rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
              transition: 'all 0.2s',
            }}
            title={isBookmarked ? 'Remove from favorites' : 'Save to favorites'}
          >
            {isBookmarked ? '🔖' : '🤍'}
          </button>

          {/* Title overlay */}
          <div style={{ position: 'absolute', bottom: '24px', left: '28px', right: '28px' }}>
            <span style={{
              display: 'inline-block', padding: '4px 14px', borderRadius: '999px',
              background: 'rgba(212,84,122,0.85)', color: 'white',
              fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', marginBottom: '8px',
            }}>
              {recipe.category}
            </span>
            <h1 style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              color: 'white', margin: 0, lineHeight: 1.1,
              textShadow: '0 2px 12px rgba(0,0,0,0.4)',
            }}>
              {recipe.name}
            </h1>
          </div>
        </div>

        {/* Meta Bar */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '24px',
          padding: '20px 28px', borderBottom: '1px dashed rgba(212,84,122,0.2)',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>⏱️</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#6b7280' }}>Prep: <strong style={{ color: '#1f2937' }}>{recipe.prepTime}m</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>⏰</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#6b7280' }}>Total: <strong style={{ color: '#1f2937' }}>{recipe.totalTime}m</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🍽️</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#6b7280' }}>Servings: <strong style={{ color: '#1f2937' }}>{recipe.servings}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: '999px', background: levelColors[recipe.level] + '22', color: levelColors[recipe.level] }}>
              👨‍🍳 {levelLabel}
            </span>
          </div>
          {recipe.averageRating !== undefined && recipe.averageRating > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
              {renderStars(Math.round(recipe.averageRating))}
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f59e0b' }}>
                {recipe.averageRating.toFixed(1)}
              </span>
              <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>({recipe.commentCount ?? 0})</span>
            </div>
          )}
        </div>

        {/* Description */}
        <div style={{ padding: '20px 28px 24px' }}>
          <p style={{ margin: 0, color: '#6b7280', lineHeight: 1.7, fontSize: '0.95rem' }}>{recipe.description}</p>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ background: 'white', borderRadius: '24px', boxShadow: '0 4px 20px rgba(212,84,122,0.08)', overflow: 'hidden' }}>
        {/* Tab Headers */}
        <div style={{ display: 'flex', borderBottom: '2px solid #fce7f3' }}>
          {(['ingredients', 'instructions', 'comments'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1, padding: '16px', border: 'none', cursor: 'pointer',
                fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '0.9rem',
                background: activeTab === tab ? 'white' : '#fdf2f8',
                color: activeTab === tab ? '#d4547a' : '#9ca3af',
                borderBottom: activeTab === tab ? '3px solid #d4547a' : '3px solid transparent',
                marginBottom: '-2px', transition: 'all 0.2s',
                textTransform: 'capitalize',
              }}
            >
              {tab === 'ingredients' && `🧂 Ingredients (${recipe.ingredients?.length ?? 0})`}
              {tab === 'instructions' && '📋 Instructions'}
              {tab === 'comments' && `💬 Comments (${comments.length})`}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ padding: '28px' }}>

          {/* ── Ingredients Tab ── */}
          {activeTab === 'ingredients' && (
            <div>
              {recipe.ingredients?.length === 0 ? (
                <p style={{ color: '#9ca3af', textAlign: 'center' }}>No ingredients listed.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {recipe.ingredients?.map((ing, i) => {
                    const importanceColors: Record<string, string> = {
                      Essential: '#fee2e2',
                      Recommended: '#fef3c7',
                      Optional: '#f0fdf4',
                    };
                    const importanceText: Record<string, string> = {
                      Essential: '#991b1b',
                      Recommended: '#92400e',
                      Optional: '#166534',
                    };
                    const bg = importanceColors[ing.importance ?? 'Essential'] ?? '#fdf2f8';
                    const textColor = importanceText[ing.importance ?? 'Essential'] ?? '#831843';

                    return (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '14px 20px', borderRadius: '14px',
                        background: '#fdf2f8', border: '1px solid #fce7f3',
                        transition: 'transform 0.15s',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '1.2rem' }}>🥄</span>
                          <span style={{ fontWeight: 600, color: '#1f2937' }}>
                            {ing.ingredientName || `Ingredient #${ing.ingredientId}`}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontWeight: 700, color: '#d4547a', fontSize: '0.95rem' }}>
                            {ing.quantity} {ing.unit}
                          </span>
                          {ing.importance && (
                            <span style={{
                              fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px',
                              borderRadius: '999px', background: bg, color: textColor,
                              letterSpacing: '0.05em',
                            }}>
                              {ing.importance}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── Instructions Tab ── */}
          {activeTab === 'instructions' && (
            <div>
              {!recipe.instructions ? (
                <p style={{ color: '#9ca3af', textAlign: 'center' }}>No instructions available.</p>
              ) : (
                <div>
                  {recipe.instructions.split('\n').filter(Boolean).map((step, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: '16px', marginBottom: '20px', alignItems: 'flex-start',
                    }}>
                      <div style={{
                        minWidth: '32px', height: '32px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #e8799a, #d4547a)',
                        color: 'white', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem',
                        flexShrink: 0, marginTop: '2px',
                      }}>
                        {i + 1}
                      </div>
                      <p style={{ margin: 0, lineHeight: 1.75, color: '#374151', fontSize: '0.95rem' }}>{step}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Comments Tab ── */}
          {activeTab === 'comments' && (
            <div>
              {/* Add Comment Form */}
              {isLoggedIn ? (
                <div style={{
                  background: '#fdf2f8', borderRadius: '16px', padding: '20px',
                  marginBottom: '28px', border: '1px solid #fce7f3',
                }}>
                  <h4 style={{ margin: '0 0 12px', color: '#d4547a', fontFamily: "'Dancing Script',cursive", fontSize: '1.3rem' }}>
                    Leave a Review
                  </h4>
                  <div style={{ marginBottom: '12px' }}>
                    {renderStars(commentForm.rating, true, (r) => setCommentForm((f) => ({ ...f, rating: r })))}
                  </div>
                  <textarea
                    value={commentForm.content}
                    onChange={(e) => setCommentForm((f) => ({ ...f, content: e.target.value }))}
                    placeholder="Share your experience with this recipe..."
                    rows={3}
                    style={{
                      width: '100%', padding: '12px 16px', borderRadius: '12px',
                      border: '2px solid #fce7f3', fontFamily: "'Nunito',sans-serif",
                      fontSize: '0.9rem', resize: 'vertical', outline: 'none',
                      boxSizing: 'border-box', background: 'white',
                    }}
                  />
                  {commentError && (
                    <p style={{ color: '#ef4444', fontSize: '0.82rem', margin: '6px 0 0' }}>{commentError}</p>
                  )}
                  <button
                    onClick={handleSubmitComment}
                    disabled={submittingComment}
                    style={{
                      marginTop: '12px', padding: '10px 28px', borderRadius: '999px',
                      border: 'none', background: 'linear-gradient(135deg, #e8799a, #d4547a)',
                      color: 'white', fontFamily: "'Nunito',sans-serif", fontWeight: 700,
                      fontSize: '0.9rem', cursor: submittingComment ? 'not-allowed' : 'pointer',
                      opacity: submittingComment ? 0.7 : 1,
                    }}
                  >
                    {submittingComment ? 'Submitting...' : '✨ Submit Review'}
                  </button>
                </div>
              ) : (
                <div style={{
                  textAlign: 'center', padding: '20px', background: '#fdf2f8',
                  borderRadius: '16px', marginBottom: '28px',
                }}>
                  <p style={{ color: '#9ca3af', marginBottom: '12px' }}>Sign in to leave a review</p>
                  <button
                    onClick={() => navigate('/login')}
                    style={{
                      padding: '10px 28px', borderRadius: '999px', border: 'none',
                      background: 'linear-gradient(135deg, #e8799a, #d4547a)',
                      color: 'white', fontFamily: "'Nunito',sans-serif",
                      fontWeight: 700, cursor: 'pointer',
                    }}
                  >
                    Sign In
                  </button>
                </div>
              )}

              {/* Comments List */}
              {loadingComments ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#9ca3af' }}>
                  <div style={{
                    width: '32px', height: '32px', border: '3px solid #fce7f3',
                    borderTopColor: '#d4547a', borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite', margin: '0 auto 8px',
                  }} />
                  Loading comments...
                </div>
              ) : comments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>💬</div>
                  <p>No comments yet. Be the first to review!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {comments.map((comment) => (
                    <div key={comment.id} style={{
                      padding: '16px 20px', background: '#fffbfd',
                      borderRadius: '16px', border: '1px solid #fce7f3',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '34px', height: '34px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #e8799a, #d4547a)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontWeight: 800, fontSize: '0.85rem',
                          }}>
                            {comment.userName?.[0]?.toUpperCase() ?? '?'}
                          </div>
                          <div>
                            <p style={{ margin: 0, fontWeight: 700, color: '#1f2937', fontSize: '0.9rem' }}>{comment.userName}</p>
                            {comment.rating !== undefined && renderStars(comment.rating)}
                          </div>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p style={{ margin: 0, color: '#4b5563', lineHeight: 1.6, fontSize: '0.9rem' }}>{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ── Delete Confirm Modal ── */}
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: '20px',
        }}>
          <div style={{
            background: 'white', borderRadius: '24px', padding: '36px',
            maxWidth: '420px', width: '100%', textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          }}>
            <div style={{ fontSize: '52px', marginBottom: '16px' }}>🗑️</div>
            <h3 style={{ fontFamily: "'Dancing Script',cursive", fontSize: '1.8rem', color: '#1f2937', marginBottom: '12px' }}>
              Delete Recipe?
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '28px', lineHeight: 1.6 }}>
              Are you sure you want to delete <strong>"{recipe.name}"</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  padding: '12px 28px', borderRadius: '999px',
                  border: '2px solid #e5e7eb', background: 'white',
                  color: '#6b7280', fontFamily: "'Nunito',sans-serif",
                  fontWeight: 700, cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deletingRecipe}
                style={{
                  padding: '12px 28px', borderRadius: '999px', border: 'none',
                  background: '#ef4444', color: 'white',
                  fontFamily: "'Nunito',sans-serif", fontWeight: 700,
                  cursor: deletingRecipe ? 'not-allowed' : 'pointer',
                  opacity: deletingRecipe ? 0.7 : 1,
                }}
              >
                {deletingRecipe ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
