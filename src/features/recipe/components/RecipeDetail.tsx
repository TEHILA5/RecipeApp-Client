import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../redux/hooks';
import { useDeleteRecipeMutation } from '../redux/recipeSlice';
import {
  useGetMySavedRecipesQuery,
  useAddBookmarkMutation,
  useRemoveBookmarkMutation,
  useAddCommentMutation,
  useAddHistoryMutation,
  useGetRecipeCommentsQuery,
} from '../../../api/userActionApi';
import type { Recipe } from '../types/recipe.types';
import type { CommentCreateDto } from '../types/userAction.types';
import { LEVEL_LABELS, CATEGORY_IMAGES } from '../types/recipe.types';
import IngredientList from './IngredientList';
import Modal from '../../../shared/components/UI/Modal';
import './RecipeDetail.css';

import timeIcon      from '../../../assets/icons/meta-time.png';
import servingsIcon  from '../../../assets/icons/meta-servings.png';
import levelEasyIcon from '../../../assets/icons/meta-level-easy.png';
import levelMedIcon  from '../../../assets/icons/meta-level-medium.png';
import levelHardIcon from '../../../assets/icons/meta-level-hard.png';
import bookmarkOn    from '../../../assets/icons/recipe-bookmark.png';
import bookmarkOff   from '../../../assets/icons/footer-heart.png';
import recipeBookIcon from '../../../assets/icons/recipe-book.png';
import editIcon      from '../../../assets/icons/profile-edit.png';
import deleteIcon    from '../../../assets/icons/action-delete.png';
import saveIcon      from '../../../assets/icons/profile-save.png'; 
import RecipeVoiceReader, { RecipeIngredientDto } from './Recipevoicereader';
import RecipePrintButton from './RecipePrintButton';
const LEVEL_ICONS: Record<number, string> = {
  1: levelEasyIcon,
  2: levelMedIcon,
  3: levelHardIcon,
};

const LEVEL_COLORS: Record<number, string> = { 1: '#22c55e', 2: '#f59e0b', 3: '#ef4444' };

interface RecipeDetailProps {
  recipe: Recipe;
  onCommentAdded?: () => void;
}

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
  const [addBookmark, { isLoading: addingBookmark }] = useAddBookmarkMutation();
  const [removeBookmark, { isLoading: removingBookmark }] = useRemoveBookmarkMutation();
  const [addComment, { isLoading: submittingComment }] = useAddCommentMutation();
  const [addHistory] = useAddHistoryMutation();

  const { data: comments = [], isLoading: loadingComments } = useGetRecipeCommentsQuery(recipe.id);
  const { data: savedRecipes = [] } = useGetMySavedRecipesQuery(undefined, { skip: !isLoggedIn });

  const isBookmarked = savedRecipes.some((a) => a.recipeId === recipe.id);
  const hasCommented = isLoggedIn ? comments.some((c) => c.userName === user?.name) : false;

  const [deletingRecipe, setDeletingRecipe] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [commentForm, setCommentForm] = useState({ content: '', rating: 5 });
  const [commentError, setCommentError] = useState('');
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions' | 'comments'>('ingredients');

  const categoryImg = CATEGORY_IMAGES[recipe.category];
  const levelLabel = LEVEL_LABELS[recipe.level as 1 | 2 | 3] ?? 'Easy';
  const levelIcon = LEVEL_ICONS[recipe.level] ?? levelEasyIcon;
  const bookmarkLoading = addingBookmark || removingBookmark;

  const historyRecorded = useState(false);
  if (isLoggedIn && !historyRecorded[0]) {
    historyRecorded[1](true);
    addHistory({ category: recipe.category });
  }

  const handleBookmark = async () => {
    if (!isLoggedIn) { navigate('/login'); return; }
    try {
      if (isBookmarked) await removeBookmark(recipe.id).unwrap();
      else              await addBookmark(recipe.id).unwrap();
    } catch { /* silent */ }
  };

  const handleSubmitComment = async () => {
    if (!isLoggedIn) { navigate('/login'); return; }
    if (!commentForm.content.trim()) { setCommentError('Please write a comment'); return; }
    setCommentError('');
    try {
      const dto: CommentCreateDto = { recipeId: recipe.id, content: commentForm.content.trim(), rating: commentForm.rating };
      await addComment(dto).unwrap();
      setCommentForm({ content: '', rating: 5 });
      onCommentAdded?.();
    } catch (err: unknown) {
      setCommentError(err instanceof Error ? err.message : 'Failed to submit comment');
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

  const TABS: { key: 'ingredients' | 'instructions' | 'comments'; label: string; icon: string }[] = [
    { key: 'ingredients',  label: `Ingredients (${recipe.ingredients?.length ?? 0})`, icon: recipeBookIcon },
    { key: 'instructions', label: 'Instructions',                                      icon: recipeBookIcon },
    { key: 'comments',     label: `Comments (${comments.length})`,                     icon: recipeBookIcon },
  ];

  return (
    <div className="rd-wrap">

      {/* Hero */}
      <div className="rd-hero">
        <div className="rd-img-wrap">
          {recipe.arrImage
            ? <img src={recipe.arrImage} alt={recipe.name} className="rd-img" />
            : <div className="rd-img-emoji">
                {categoryImg
                  ? <img src={categoryImg} alt={recipe.category} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  : <img src={recipeBookIcon} alt="recipe" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
                }
              </div>
          }
          <div className="rd-img-overlay" />

          {isAdmin && (
            <div className="rd-admin-btns">
              <button onClick={() => navigate(`/recipes/${recipe.id}/edit`)} className="rd-btn-edit">
                <img src={editIcon} alt="Edit" style={{ width: '24px', height: '24px', objectFit: 'contain', marginRight: '0px', verticalAlign: 'middle' }} />
              </button>
              <button onClick={() => setShowDeleteConfirm(true)} className="rd-btn-delete-hero">
                <img src={deleteIcon} alt="Delete" style={{ width: '24px', height: '24px', objectFit: 'contain', marginRight: '0px', verticalAlign: 'middle' }}/>
              </button>
            </div>
          )}

          <button
            onClick={handleBookmark}
            disabled={bookmarkLoading}
            className={`rd-bookmark ${isBookmarked ? 'rd-bookmark--active' : ''}`}
          >
            <img
              src={isBookmarked ? bookmarkOn : bookmarkOff}
              alt={isBookmarked ? 'Saved' : 'Save'}
              style={{ width: '30px', height: '30px', objectFit: 'contain', filter: isBookmarked ? 'brightness(0) invert(1)' : 'none' }}
            />
          </button>

          <div className="rd-img-footer">
            <span className="rd-category-badge">{recipe.category}</span>
            <h1 className="rd-title">{recipe.name}</h1>
          </div>
        </div>
        <RecipePrintButton recipe={recipe} />

        {/* Meta bar */}
        <div className="rd-meta-bar">
          <div className="rd-meta-item">
            <img src={timeIcon} alt="Prep time" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
            Prep: <strong>{recipe.prepTime}m</strong>
          </div>
          <div className="rd-meta-item">
            <img src={timeIcon} alt="Total time" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
            Total: <strong>{recipe.totalTime}m</strong>
          </div>
          <div className="rd-meta-item">
            <img src={servingsIcon} alt="Servings" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
            Servings: <strong>{recipe.servings}</strong>
          </div>
          <div className="rd-meta-item">
            <span className="rd-level-badge" style={{ background: LEVEL_COLORS[recipe.level] + '22', color: LEVEL_COLORS[recipe.level], display: 'flex', alignItems: 'center', gap: '6px' }}>
              <img src={levelIcon} alt={levelLabel} style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
              {levelLabel}
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
          {TABS.map(({ key, label }) => (
            <button key={key} onClick={() => setActiveTab(key)} className={`rd-tab ${activeTab === key ? 'rd-tab--active' : ''}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="rd-tab-content">

          {activeTab === 'ingredients' && <IngredientList ingredients={recipe.ingredients} />}

          {activeTab === 'instructions' && (
            !recipe.instructions
              ? <p className="rd-empty">No instructions available.</p>
              : <>
                {/* ← Add voice reader here */}
                <RecipeVoiceReader
                  recipe={{
                    name: recipe.name,
                    instructions: recipe.instructions,
                    recipeIngredients: (recipe.ingredients ?? []) as RecipeIngredientDto[],
                  }}
                />
                
               <div className="rd-steps">
                  {recipe.instructions.split('\n').filter(Boolean).map((step, i) => (
                    <div key={i} className="rd-step">
                      <div className="rd-step-num">{i + 1}</div>
                      <p className="rd-step-text">{step}</p>
                    </div>
                  ))}
                </div>
              </>
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
                  <button
                    onClick={handleSubmitComment}
                    disabled={submittingComment}
                    className={`rd-submit-btn ${submittingComment ? 'rd-submit-btn--busy' : ''}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <img src={saveIcon} alt="Submit" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                    {submittingComment ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              ) : isLoggedIn && hasCommented ? (
                <div className="rd-already-reviewed">
                  You already reviewed this recipe
                </div>
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
                  <img src={recipeBookIcon} alt="No comments" className="rd-no-comments-icon" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
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

      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Delete Recipe?">
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
