import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../redux/hooks';
import { useDeleteRecipeMutation } from '../redux/recipeSlice';
import { getMySavedRecipes, addBookmark, removeBookmark, addComment, addHistory, getRecipeComments } from '../../../api/userActionApi';
import type { Recipe } from '../types/recipe.types';
import type { UserActionDto, CommentCreateDto } from '../types/userAction.types';
import { LEVEL_LABELS, CATEGORY_EMOJIS } from '../types/recipe.types';
import IngredientList from './IngredientList';
import Modal from '../../../shared/components/UI/Modal';
import './RecipeDetail.css';

interface RecipeDetailProps {
  recipe: Recipe;
  onCommentAdded?: () => void;
}

const LEVEL_COLORS: Record<number, string> = { 1: '#22c55e', 2: '#f59e0b', 3: '#ef4444' };

function Stars({ rating, interactive = false, onChange }: { rating: number; interactive?: boolean; onChange?: (r: number) => void }) {
  return (
    <div className="rd-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => interactive && onChange?.(star)}
          className={`rd-star ${interactive ? 'rd-star--interactive' : ''}`}
          style={{ color: star <= rating ? '#f59e0b' : '#d1d5db' }}
        >★</span>
      ))}
    </div>
  );
}

export default function RecipeDetail({ recipe, onCommentAdded }: RecipeDetailProps) {
  const navigate = useNavigate();
  const { isAdmin, user } = useAppSelector((s) => s.auth);
  const isLoggedIn = !!user;

  const [deleteRecipe] = useDeleteRecipeMutation();

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
  const [hasCommented, setHasCommented] = useState(false);

  const emoji = CATEGORY_EMOJIS[recipe.category] ?? '🍰';
  const levelLabel = LEVEL_LABELS[recipe.level as 1 | 2 | 3] ?? 'Easy';

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
      const data = await getRecipeComments(recipe.id);
      setComments(data);
      if (isLoggedIn) setHasCommented(data.some((c) => c.userName === user?.name));
    } catch (err: unknown) {
      setCommentError(err instanceof Error ? err.message : 'Failed to load comments');
    } finally {
      setLoadingComments(false);
    }
  };

  const checkBookmarkStatus = async () => {
    try {
      const saved = await getMySavedRecipes();
      setIsBookmarked(saved.some((a) => a.recipeId === recipe.id));
    } catch (err: unknown) {
      setCommentError(err instanceof Error ? err.message : 'Failed to check bookmark status');
    }
  };

  const recordHistory = async () => {
    try { await addHistory({ category: recipe.category }); } catch (err: unknown) {
      setCommentError(err instanceof Error ? err.message : 'Failed to record history');
    }
  };

  const handleBookmark = async () => {
    if (!isLoggedIn) { navigate('/login'); return; }
    setBookmarkLoading(true);
    try {
      if (isBookmarked) { await removeBookmark(recipe.id); setIsBookmarked(false); }
      else              { await addBookmark(recipe.id);    setIsBookmarked(true); }
    } catch (err: unknown) {
      setCommentError(err instanceof Error ? err.message : 'Failed to update bookmark status');
    }
    finally { setBookmarkLoading(false); }
  };

  const handleSubmitComment = async () => {
    if (!isLoggedIn) { navigate('/login'); return; }
    if (!commentForm.content.trim()) { setCommentError('Please write a comment'); return; }
    setCommentError('');
    setSubmittingComment(true);
    try {
      const dto: CommentCreateDto = { recipeId: recipe.id, content: commentForm.content.trim(), rating: commentForm.rating };
      const newComment = await addComment(dto);
      setComments((prev) => [...prev, newComment]);
      setCommentForm({ content: '', rating: 5 });
      setHasCommented(true);
      onCommentAdded?.();
    } catch (err: unknown) {
      setCommentError(err instanceof Error ? err.message : 'Failed to submit comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDelete = async () => {
    setDeletingRecipe(true);
    try {
      await deleteRecipe(recipe.id).unwrap();
      navigate('/recipes');
    } catch {
      setDeletingRecipe(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="rd-wrap">

      {/* Hero */}
      <div className="rd-hero">
        <div className="rd-img-wrap">
          {recipe.arrImage
            ? <img src={recipe.arrImage} alt={recipe.name} className="rd-img" />
            : <div className="rd-img-emoji">{emoji}</div>}
          <div className="rd-img-overlay" />

          {isAdmin && (
            <div className="rd-admin-btns">
              <button onClick={() => navigate(`/recipes/${recipe.id}/edit`)} className="rd-btn-edit">✏️ Edit</button>
              <button onClick={() => setShowDeleteConfirm(true)} className="rd-btn-delete-hero">🗑️ Delete</button>
            </div>
          )}

          <button onClick={handleBookmark} disabled={bookmarkLoading} className={`rd-bookmark ${isBookmarked ? 'rd-bookmark--active' : ''}`}>
            {isBookmarked ? '🔖' : '🤍'}
          </button>

          <div className="rd-img-footer">
            <span className="rd-category-badge">{recipe.category}</span>
            <h1 className="rd-title">{recipe.name}</h1>
          </div>
        </div>

        <div className="rd-meta-bar">
          <div className="rd-meta-item"><span>⏱️</span> Prep: <strong>{recipe.prepTime}m</strong></div>
          <div className="rd-meta-item"><span>⏰</span> Total: <strong>{recipe.totalTime}m</strong></div>
          <div className="rd-meta-item"><span>🍽️</span> Servings: <strong>{recipe.servings}</strong></div>
          <div className="rd-meta-item">
            <span className="rd-level-badge" style={{ background: LEVEL_COLORS[recipe.level] + '22', color: LEVEL_COLORS[recipe.level] }}>
              👨‍🍳 {levelLabel}
            </span>
          </div>
          {recipe.averageRating !== undefined && recipe.averageRating > 0 && (
            <div className="rd-rating-wrap">
              <Stars rating={Math.round(recipe.averageRating)} />
              <span className="rd-rating-num">{recipe.averageRating.toFixed(1)}</span>
              <span className="rd-rating-count">({recipe.commentCount ?? 0})</span>
            </div>
          )}
        </div>

        <div className="rd-desc">{recipe.description}</div>
      </div>

      {/* Tabs */}
      <div className="rd-tabs-wrap">
        <div className="rd-tabs">
          {(['ingredients', 'instructions', 'comments'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`rd-tab ${activeTab === tab ? 'rd-tab--active' : ''}`}>
              {tab === 'ingredients'  && `🧂 Ingredients (${recipe.ingredients?.length ?? 0})`}
              {tab === 'instructions' && '📋 Instructions'}
              {tab === 'comments'     && `💬 Comments (${comments.length})`}
            </button>
          ))}
        </div>

        <div className="rd-tab-content">

          {activeTab === 'ingredients' && <IngredientList ingredients={recipe.ingredients} />}

          {activeTab === 'instructions' && (
            !recipe.instructions
              ? <p className="rd-empty">No instructions available.</p>
              : <div className="rd-steps">
                  {recipe.instructions.split('\n').filter(Boolean).map((step, i) => (
                    <div key={i} className="rd-step">
                      <div className="rd-step-num">{i + 1}</div>
                      <p className="rd-step-text">{step}</p>
                    </div>
                  ))}
                </div>
          )}

          {activeTab === 'comments' && (
            <div>
              {isLoggedIn && !hasCommented ? (
                <div className="rd-review-form">
                  <h4 className="rd-review-title">Leave a Review</h4>
                  <div className="rd-review-stars">
                    <Stars rating={commentForm.rating} interactive onChange={(r) => setCommentForm((f) => ({ ...f, rating: r }))} />
                  </div>
                  <textarea
                    value={commentForm.content}
                    onChange={(e) => setCommentForm((f) => ({ ...f, content: e.target.value }))}
                    placeholder="Share your experience with this recipe..."
                    rows={3}
                    className="rd-textarea"
                  />
                  {commentError && <p className="rd-comment-error">{commentError}</p>}
                  <button onClick={handleSubmitComment} disabled={submittingComment} className={`rd-submit-btn ${submittingComment ? 'rd-submit-btn--busy' : ''}`}>
                    {submittingComment ? 'Submitting...' : '✨ Submit Review'}
                  </button>
                </div>
              ) : isLoggedIn && hasCommented ? (
                <div className="rd-already-reviewed">✅ You already reviewed this recipe</div>
              ) : (
                <div className="rd-sign-in-prompt">
                  <p>Sign in to leave a review</p>
                  <button onClick={() => navigate('/login')} className="rd-sign-in-btn">Sign In</button>
                </div>
              )}

              {loadingComments ? (
                <div className="rd-comments-loading">
                  <div className="rd-spinner" />
                  Loading comments...
                </div>
              ) : comments.length === 0 ? (
                <div className="rd-no-comments">
                  <div className="rd-no-comments-icon">💬</div>
                  <p>No comments yet. Be the first to review!</p>
                </div>
              ) : (
                <div className="rd-comments-list">
                  {comments.map((comment) => (
                    <div key={comment.id} className="rd-comment">
                      <div className="rd-comment-header">
                        <div className="rd-comment-user">
                          <div className="rd-comment-avatar">{comment.userName?.[0]?.toUpperCase() ?? '?'}</div>
                          <div>
                            <p className="rd-comment-name">{comment.userName}</p>
                            {comment.rating !== undefined && <Stars rating={comment.rating} />}
                          </div>
                        </div>
                        <span className="rd-comment-date">{new Date(comment.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="rd-comment-text">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="🗑️ Delete Recipe?">
        <p className="rd-modal-text">
          Are you sure you want to delete <strong>"{recipe.name}"</strong>? This action cannot be undone.
        </p>
        <div className="rd-modal-actions">
          <button onClick={() => setShowDeleteConfirm(false)} className="rd-modal-cancel">Cancel</button>
          <button onClick={handleDelete} disabled={deletingRecipe} className={`rd-modal-confirm ${deletingRecipe ? 'rd-modal-confirm--busy' : ''}`}>
            {deletingRecipe ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
