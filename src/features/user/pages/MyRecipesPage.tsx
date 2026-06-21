import { useAppSelector } from '../../../redux/hooks';
import MyFavorites from '../components/MyFavorites';
import PageHeader from '../../../shared/components/UI/PageHeader';
import myBook from '../../../assets/images/my-book.jpg';
import './MyRecipesPage.css';

export default function MyRecipesPage() {
  const { user } = useAppSelector((s) => s.auth);

  return (
    <div className="my-recipes-page">
      <PageHeader
        layout="media-row"
        size="xl"
        padding="flush"
        align="left"
        lead={<img src={myBook} alt="Recipe Book" className="book-img" />}
        eyebrow="✦ My Collection"
        title={<>{user?.name ? `${user.name}'s` : 'My'} <span>Recipe Book</span></>}
        subtitle="Your saved dessert recipes, all in one place"
      >
        <div className="tabs">
          <div className="tab active">
            <img src="/src/assets/icons/recipe-bookmark.png" alt="Saved" className="tab__icon" />
            Saved Recipes
          </div>
        </div>
      </PageHeader>

      <div className="my-recipes-body">
        <MyFavorites />
      </div>
    </div>
  );
}