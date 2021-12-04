const ApiKey = '7eae7a88536b49f8897cb40f0f977a30';
const baseUrl = 'https://api.football-data.org/v2/';
const leagueId = '2021';
const baseEndPoin = `${baseUrl}competitions/${leagueId}`;
const teamEndPoin = `${baseUrl}competitions/${leagueId}/teams`;
const standingEndPoin = `${baseUrl}competitions/${leagueId}/standings`;
const matchEndPoin = `${baseUrl}competitions/${leagueId}/matches`;

const contents = document.querySelector('#content-list');
const title = document.querySelector('.card-title');
const fetchHeaders = {
  headers: {
    'X-Auth-Token': ApiKey,
  },
};

// Menampilkan daftar team
function getListTeams() {
  title.innerHTML = 'List of Premier League clubs';
  fetch(teamEndPoin, fetchHeaders)
    .then(response => response.json())
    .then(resJson => {
      console.log(resJson.teams);
      let teams = '';
      resJson.teams.forEach(team => {
        teams += `
        <li class="collection-item avatar">
            <img src="${team.crestUrl}" alt="" class="circle">
            <span class="title">${team.name}</span>
            <p> Founded : ${team.founded}<br>
             Stadium : ${team.venue}
            </p>
            <a href="#!" class="secondary-content"><i class="material-icons">grade</i></a>
      </li>`;
      });
      contents.innerHTML = `<ul class="collection"> ${teams} </ul>`;
    })
    .catch(err => {
      console.err(err);
    });
}

// Menampilkan tabel klasemen
function getListStandings() {
  title.innerHTML = 'English Premier League Standings';
  fetch(standingEndPoin, fetchHeaders)
    .then(response => response.json())
    .then(resJson => {
      console.log(resJson.standings[0]);
      let teams = '';
      let num = 1;
      resJson.standings[0].table.forEach(team => {
        teams += `
              <tr>
                <td style="padding-left:20px">${num}.</td>
                <td><img src="${team.team.crestUrl}" alt="${team.team.name}" width="30px"></td>
                <td>${team.team.name}</td>
                <td>${team.playedGames}</td>
                <td>${team.won}</td>
                <td>${team.draw}</td>
                <td>${team.lost}</td>
                <td>${team.points}</td>
            </tr>`;
        num++;
      });
      contents.innerHTML = `
        <div class="card">
        <table class="stripped responsive-table">
            <thead>
                <th></th>
                <th></th>
                <th>Name Team</th>
                <th>PG</th>
                <th>W</th>
                <th>D</th>
                <th>L</th>
                <th>P</th>
            </thead>
            <tbody>${teams}</tbody>
        </table>
        </div>`;
    })
    .catch(err => {
      console.err(err);
    });
}

// Menampilkan Jadwal Pertandingan
function getListMatches() {
  title.innerHTML = 'English Premier League Fixtures And Results';
  fetch(matchEndPoin, fetchHeaders)
    .then(response => response.json())
    .then(resJson => {
      console.log(resJson.matches);
      let matchs = '';
      let num = 1;
      resJson.matches.forEach(match => {
        let date = new Date(match.utcDate).toLocaleDateString('id');
        let scoreHomeTeam =
          match.score.fullTime.homeTeam == null
            ? 0
            : match.score.fullTime.homeTeam;
        let scoreAwayTeam =
          match.score.fullTime.awayTeam == null
            ? 0
            : match.score.fullTime.awayTeam;
        matchs += `
                <tr>
                  <td style="padding-left:20px">${num}.</td>
                  <td>${match.homeTeam.name} VS ${match.awayTeam.name} </td>
                  <td>${date}</td>
                  <td>${scoreHomeTeam}:${scoreAwayTeam}</td>
              </tr>`;
        num++;
      });
      contents.innerHTML = `
          <div class="card">
          <table class="stripped responsive-table">
              <thead>
                  <th></th>
                  <th>Match</th>
                  <th>Date</th>
                  <th>Score Fulltime</th>
              </thead>
              <tbody>${matchs}</tbody>
          </table>
          </div>`;
    })
    .catch(err => {
      console.err(err);
    });
}

// untuk mereload page
function loadPage(page) {
  if (page == 'teams') {
    getListTeams();
  } else if (page == 'standings') {
    getListStandings();
  } else if (page == 'matches') {
    getListMatches();
  }

  //   switch (page) {
  //     case 'teams':
  //       getListTeams();
  //       break;
  //     case 'standings':
  //       break;
  //     case 'matches':
  //       break;
  //   }
}

document.addEventListener('DOMContentLoaded', () => {
  var elems = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(elems);

  // menangkap hastag id
  document.querySelectorAll('.sidenav a, .topnav a').forEach(el => {
    el.addEventListener('click', e => {
      let sideNav = document.querySelector('.sidenav');
      M.Sidenav.getInstance(sideNav).close();
      page = e.target.getAttribute('href').substr(1); // ketika di call tampil id string ke 1
      loadPage(page);
    });
  });

  let page = window.location.hash.substr(1); // ketika di call tampil id string ke 1
  if (page === '' || page === '!') page = 'teams'; // ketika hastag kosong maka defaultnya page teams
  loadPage(page);
  //getListTeams();
});
