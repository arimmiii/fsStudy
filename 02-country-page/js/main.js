const cardSection = document.querySelector('.cardSection');
const searchInput = document.querySelector('#countryInput');
const searchButton = document.querySelector('#searchButton');

let countries = [];

// 서버에서 국가들 데이터 가져오기
const url = "https://api.api-ninjas.com/v1/country?limit=20";
const API_KEY = "n78SYgWxgt4x6huNfpgiCV9Nwvq6yA7ZtEcBYpW0";


async function getData() {
  try {
    const response = await fetch(url, {
      headers: {
        'X-Api-Key': API_KEY
      }
    });

    countries = await response.json();
    console.log(countries);
    renderCard(countries);

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

getData();


// 데이터를 받아 화면에 카드로 그려주는 함수
function renderCard(data) {
  if (data.length === 0) return;

  data.forEach(country => {
    const ua = country.iso2.toLowerCase();
    const countryUrl = `https://flagcdn.com/w320/${ua}.png`;

    //카드 하나씩 만들기
    const cardDiv = document.createElement('div');
    cardDiv.className = 'countryCard';
    const bgImg = document.createElement('img');
    bgImg.src = countryUrl;
    bgImg.alt = `${country.name} flag`;
    const h3Tag = document.createElement('h3');
    h3Tag.textContent = country.name;

    cardDiv.appendChild(bgImg);
    cardDiv.appendChild(h3Tag);

    // cardSection에 넣기
    cardSection.appendChild(cardDiv);
  })
}

// 검색 기능


// 상세 페이지 이동