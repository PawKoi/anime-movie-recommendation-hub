import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { Title } from "../models/Title.js";
import { Review } from "../models/Review.js";

async function seed() {
  await connectDB(process.env.MONGODB_URI);

  console.log("Clearing existing data...");
  await Promise.all([
    User.deleteMany({}),
    Title.deleteMany({}),
    Review.deleteMany({})
  ]);

  console.log("Inserting users...");
  const passwordHash = await bcrypt.hash("Password123!", 10);
  const [user1, user2] = await User.create([
    { email: "user1@example.com", passwordHash },
    { email: "user2@example.com", passwordHash }
  ]);

  console.log("Inserting titles...");
  const titles = await Title.create([
    
    {
  name: "Forrest Gump",
  type: "Movie",
  genres: ["drama", "romance"],
  year: 1994,
  synopsis:
    "A man with a simple outlook recounts his life across key moments in U.S. history.",
  poster:
    "https://ntvb.tmsimg.com/assets/p15829_v_h8_aw.jpg?w=1280&h=720"
},
{
  name: "The Shawshank Redemption",
  type: "Movie",
  genres: ["drama"],
  year: 1994,
  synopsis:
    "A banker forms a deep friendship in prison while holding on to hope and his innocence.",
  poster:
    "https://www.themoviedb.org/t/p/original/xXXFdqV965crlxCO3dj3PhtcCAf.jpg"
},
{
  name: "The Perks of Being a Wallflower",
  type: "Movie",
  genres: ["drama", "romance"],
  year: 2012,
  synopsis:
    "A shy teen finds friendship and healing with two eccentric seniors.",
  poster:
    "https://wallpaperaccess.com/full/2315839.jpg"
},
{
  name: "The Dark Knight",
  type: "Movie",
  genres: ["action", "crime"],
  year: 2008,
  synopsis:
    "Batman faces a chaos-loving criminal mastermind who pushes Gotham to the edge.",
  poster:
    "https://wallpaperaccess.com/full/442581.jpg"
},
{
  name: "Changeling",
  type: "Movie",
  genres: ["drama", "mystery"],
  year: 2008,
  synopsis:
    "After her son disappears, a mother challenges authorities who insist an impostor is her child.",
  poster:
    "https://metadata-static.plex.tv/1/gracenote/17a87d74ecf3500de87702354e42faa4.jpg"
},
{
  name: "This Boy's Life",
  type: "Movie",
  genres: ["drama"],
  year: 1993,
  synopsis:
    "A teen struggles with his abusive stepfather in 1950s small-town America.",
  poster:
    "https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/685224C34A25D9308D93CF6C08FE8D63269A451D8E60664D035A79A3AB993161/scale?width=1200&amp;aspectRatio=1.78&amp;format=webp"
},
{
  name: "It's a Wonderful Life",
  type: "Movie",
  genres: ["drama", "fantasy"],
  year: 1946,
  synopsis:
    "An angel shows a despairing man how much his life has meant to others.",
  poster:
    "https://th.bing.com/th/id/R.376ab07af8a40f98544c53dc65e9bc8e?rik=5fFEqDWNH%2fR1mw&riu=http%3a%2f%2fimages2.fanpop.com%2fimage%2fphotos%2f9600000%2fIt-s-A-Wonderful-Life-its-a-wonderful-life-9644956-1920-1080.jpg&ehk=0tK3rcns3DddDWKoq0LwoT7icfaQAFlz4CTm6x1dt5U%3d&risl=&pid=ImgRaw&r=0"
},
{
  name: "The Silence of the Lambs",
  type: "Movie",
  genres: ["thriller", "crime"],
  year: 1991,
  synopsis:
    "An FBI trainee seeks help from an imprisoned killer to catch another serial murderer.",
  poster:
    "https://wallpapercave.com/wp/wp3776892.jpg"
},
{
  name: "8 Mile",
  type: "Movie",
  genres: ["drama", "music"],
  year: 2002,
  synopsis:
    "A young rapper in Detroit battles doubt and hardship while chasing a break.",
  poster:
    "https://wallpapercave.com/wp/n3bFY2C.jpg"
},
{
  name: "The Breakfast Club",
  type: "Movie",
  genres: ["drama", "comedy"],
  year: 1985,
  synopsis:
    "Five high school students in detention discover they have more in common than they thought.",
  poster:
    "https://image.tmdb.org/t/p/original/5GbGHRnQCOHARgxCjRe8pfnsI79.jpg"
},
{
  name: "Neon Genesis Evangelion",
  type: "Anime",
  genres: ["mecha", "psychological"],
  year: 1995,
  synopsis:
    "Teen pilots control mysterious bio-mechs to fight beings that threaten humanity.",
  poster:
    "https://static1.srcdn.com/wordpress/wp-content/uploads/2019/07/2.-Eva-v-Armisael.jpg"
},
{
  name: "Mob Psycho 100",
  type: "Anime",
  genres: ["action", "supernatural"],
  year: 2016,
  synopsis:
    "A quiet middle schooler with immense psychic power learns to manage his emotions and abilities.",
  poster:
    "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2022/09/Mob-Psycho-100-Poster.jpg"
},
{
  name: "Devilman Crybaby",
  type: "Anime",
  genres: ["horror", "drama"],
  year: 2018,
  synopsis:
    "A sensitive teen becomes a half-demon and fights to protect humanity as society unravels.",
  poster:
    "https://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/media/image/2018/01/devilman-crybaby.jpg"
},
{
  name: "Samurai Champloo",
  type: "Anime",
  genres: ["action", "historical"],
  year: 2004,
  synopsis:
    "Two swordsmen and a girl roam an anachronistic Edo Japan mixing samurai style and hip‑hop.",
  poster:
    "https://images.alphacoders.com/690/thumb-1920-690537.png"
},
{
  name: "Steins;Gate",
  type: "Anime",
  genres: ["sci-fi", "thriller"],
  year: 2011,
  synopsis:
    "A self‑proclaimed mad scientist and friends accidentally invent a way to send messages to the past.",
  poster:
    "https://wallpaperaccess.com/full/3382977.png"
},
{
  name: "Attack on Titan",
  type: "Anime",
  genres: ["action", "dark fantasy"],
  year: 2013,
  synopsis:
    "Humans behind massive walls fight monstrous Titans that devour people.",
  poster:
    "https://images.everyeye.it/img-notizie/attack-on-titan-final-season-episodio-terza-crunchyroll-v3-638243.jpg"
},
{
  name: "Cowboy Bebop",
  type: "Anime",
  genres: ["sci-fi", "action"],
  year: 1998,
  synopsis:
    "Bounty hunters cruise the solar system chasing criminals while running from their pasts.",
  poster:
    "https://tse1.mm.bing.net/th/id/OIP.Rc4Xtd2F6D61_VzeptpGIQHaDt?rs=1&pid=ImgDetMain&o=7&rm=3"
},
{
  name: "Demon Slayer: Kimetsu no Yaiba",
  type: "Anime",
  genres: ["action", "fantasy"],
  year: 2019,
  synopsis:
    "A kindhearted boy becomes a demon slayer after his family is killed and his sister is turned.",
  poster:
    "https://bleedingcool.com/wp-content/uploads/2025/04/DSKY-MtN_Crunchyroll_Base-Assets_2x3_2000x3000-2000x1125.jpg"
},
{
  name: "Death Note",
  type: "Anime",
  genres: ["thriller", "supernatural"],
  year: 2006,
  synopsis:
    "A gifted student finds a notebook that lets him kill anyone by writing their name.",
  poster:
    "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2021/07/death-note-episode-featured.jpg"
},
{
  name: "Fullmetal Alchemist: Brotherhood",
  type: "Anime",
  genres: ["fantasy", "adventure"],
  year: 2009,
  synopsis:
    "Two brothers who broke alchemy’s laws search for a way to restore their bodies.",
  poster:
    "https://static1.cbrimages.com/wordpress/wp-content/uploads/2023/07/should-you-watch-fullmetal-alchemist-or-brotherhood-first.jpg"
}

  ]);

  console.log("Inserting reviews...");
  await Review.create([
    {
      userId: user1._id,
      titleId: titles[0]._id,
      rating: 5,
      text: "Amazing worldbuilding."
    },
    {
      userId: user2._id,
      titleId: titles[2]._id,
      rating: 4,
      text: "Complex and engaging."
    }
  ]);

  console.log("Seed complete");
  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
