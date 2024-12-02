import * as React from "react";
import PlaceholderPoster from "../../../../assets/img/placeholder.jpg";

// Props interface defining the structure of the movie object
interface MovieDisplayProps {
  movie: {
    title: string;
    genres: string[];
    releaseYear: string;
    synopsis: string;
    poster: string;
    runtime: number;
    cast: string[];
    directors: string[];
    producers: string[];
    language: string;
  };
}

// Mapping of language codes to full names
const languageMap: { [key: string]: string } = {
  aa: "Afar",
  ab: "Abkhazian",
  ae: "Avestan",
  af: "Afrikaans",
  ak: "Akan",
  am: "Amharic",
  an: "Aragonese",
  ar: "Arabic",
  as: "Assamese",
  av: "Avaric",
  ay: "Aymara",
  az: "Azerbaijani",
  ba: "Bashkir",
  be: "Belarusian",
  bg: "Bulgarian",
  bh: "Bihari",
  bi: "Bislama",
  bm: "Bambara",
  bn: "Bengali",
  bo: "Tibetan",
  br: "Breton",
  bs: "Bosnian",
  ca: "Catalan",
  ce: "Chechen",
  ch: "Chamorro",
  co: "Corsican",
  cr: "Cree",
  cs: "Czech",
  cu: "Slavic",
  cv: "Chuvash",
  cy: "Welsh",
  da: "Danish",
  de: "German",
  dv: "Divehi",
  dz: "Dzongkha",
  ee: "Ewe",
  el: "Greek",
  en: "English",
  eo: "Esperanto",
  es: "Spanish",
  et: "Estonian",
  eu: "Basque",
  fa: "Persian",
  ff: "Fulah",
  fi: "Finnish",
  fj: "Fijian",
  fo: "Faroese",
  fr: "French",
  fy: "Frisian",
  ga: "Irish",
  gd: "Gaelic",
  gl: "Galician",
  gn: "Guarani",
  gu: "Gujarati",
  gv: "Manx",
  ha: "Hausa",
  he: "Hebrew",
  hi: "Hindi",
  ho: "Hiri Motu",
  hr: "Croatian",
  ht: "Haitian",
  hu: "Hungarian",
  hy: "Armenian",
  hz: "Herero",
  ia: "Interlingua",
  id: "Indonesian",
  ie: "Interlingue",
  ig: "Igbo",
  ii: "Yi",
  ik: "Inupiaq",
  io: "Ido",
  is: "Icelandic",
  it: "Italian",
  iu: "Inuktitut",
  ja: "Japanese",
  jv: "Javanese",
  ka: "Georgian",
  kg: "Kongo",
  ki: "Kikuyu",
  kj: "Kwanyama",
  kk: "Kazakh",
  kl: "Kalaallisut",
  km: "Khmer",
  kn: "Kannada",
  ko: "Korean",
  kr: "Kanuri",
  ks: "Kashmiri",
  ku: "Kurdish",
  kv: "Komi",
  kw: "Cornish",
  ky: "Kirghiz",
  la: "Latin",
  lb: "Luxembourgish",
  lg: "Ganda",
  li: "Limburgish",
  ln: "Lingala",
  lo: "Lao",
  lt: "Lithuanian",
  lu: "Luba-Katanga",
  lv: "Latvian",
  mg: "Malagasy",
  mh: "Marshall",
  mi: "Maori",
  mk: "Macedonian",
  ml: "Malayalam",
  mn: "Mongolian",
  mr: "Marathi",
  ms: "Malay",
  mt: "Maltese",
  my: "Burmese",
  na: "Nauru",
  nb: "Norwegian Bokmål",
  nd: "Ndebele",
  ne: "Nepali",
  ng: "Ndonga",
  nl: "Dutch",
  nn: "Norwegian Nynorsk",
  no: "Norwegian",
  nr: "Ndebele",
  nv: "Navajo",
  ny: "Chichewa",
  oc: "Occitan",
  oj: "Ojibwa",
  om: "Oromo",
  or: "Oriya",
  os: "Ossetian",
  pa: "Punjabi",
  pi: "Pali",
  pl: "Polish",
  ps: "Pashto",
  pt: "Portuguese",
  qu: "Quechua",
  rm: "Romansh",
  rn: "Rundi",
  ro: "Romanian",
  ru: "Russian",
  rw: "Kinyarwanda",
  sa: "Sanskrit",
  sc: "Sardinian",
  sd: "Sindhi",
  se: "Northern Sami",
  sg: "Sango",
  si: "Sinhala",
  sk: "Slovak",
  sl: "Slovenian",
  sm: "Samoan",
  sn: "Shona",
  so: "Somali",
  sq: "Albanian",
  sr: "Serbian",
  ss: "Swati",
  st: "Sotho",
  su: "Sundanese",
  sv: "Swedish",
  sw: "Swahili",
  ta: "Tamil",
  te: "Telugu",
  tg: "Tajik",
  th: "Thai",
  ti: "Tigrinya",
  tk: "Turkmen",
  tl: "Tagalog",
  tn: "Tswana",
  to: "Tonga",
  tr: "Turkish",
  ts: "Tsonga",
  tt: "Tatar",
  tw: "Twi",
  ty: "Tahitian",
  ug: "Uighur",
  uk: "Ukrainian",
  ur: "Urdu",
  uz: "Uzbek",
  ve: "Venda",
  vi: "Vietnamese",
  vo: "Volapük",
  wa: "Walloon",
  wo: "Wolof",
  xh: "Xhosa",
  yi: "Yiddish",
  yo: "Yoruba",
  za: "Zhuang",
  zh: "Chinese",
  zu: "Zulu"
};


// Functional component to display movie details
const MovieDisplay: React.FC<MovieDisplayProps> = ({ movie }) => {
  const languageFullName = languageMap[movie.language] || movie.language;

  return (
    <div className="movie-container">
      <img
        className="movie-poster"
        src={movie.poster || PlaceholderPoster}
        alt={movie.poster ? `Movie poster for ${movie.title}` : `Placeholder for ${movie.title}`}
      />
      <div className="movie-details">
        <h2 className="movie-title">{movie.title}</h2>
        <div className="movie-meta">
          <p className="movie-genres">{movie.genres.join(", ")}</p>
          <p className="movie-release">Release Year: {movie.releaseYear}</p>
        </div>
        <div className="movie-runtime">
          Runtime: {movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : "Not Available"}
        </div>
        <div className="movie-synopsis">
          <p><strong>Synopsis:</strong> {movie.synopsis}</p>
        </div>
        <div className="movie-credits">
          <p><strong>Cast:</strong> {movie.cast.join(", ")}</p>
          <p><strong>Director(s):</strong> {movie.directors.join(", ")}</p>
          <p><strong>Producer(s):</strong> {movie.producers.join(", ")}</p>
        </div>
        <div className="movie-language">
          <p><strong>Language:</strong> {languageFullName}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieDisplay; // Export the component for use in other files
