import { useAppSelector } from '../../../redux/hooks';
import MyFavorites from '../components/MyFavorites';
import myBook from '../../../assets/images/my-book.jpg';
import './MyRecipesPage.css';

export default function MyRecipesPage() {
  const { user } = useAppSelector((s) => s.auth);

  return (
    <div className="my-recipes-page">
      <div className="my-recipes-header">
        <div className="my-recipes-header-inner">
          <div className="header-top">
            <img src={myBook} alt="Recipe Book" className="book-img" />
            <div>
              <div className="header-eyebrow">✦ My Collection</div>
              <h1>
                {user?.name ? `${user.name}'s` : 'My'} <span>Recipe Book</span>
              </h1>
              <p>Your saved dessert recipes, all in one place</p>
            </div>
          </div>

          <div className="tabs">
            <div className="tab active" style={{ display: 'flex', alignItems: 'center', gap: '4px', }}>
              <img src="/src/assets/icons/recipe-bookmark.png" alt="Saved" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
              {' '} Saved Recipes
            </div>
          </div>
        </div>
      </div>

      <div className="my-recipes-body">
        <MyFavorites />
      </div>
    </div>
  );
}
