const ApiKey = "2f40afeb0c184be3a0dad427e307bac1";
const baseUrl = "https://api.football-data.org/v2/";
const leagueId = "2021";
const baseEndPoin = `${baseUrl}competitions/${leagueId}`;
const teamEndPoin = `${baseUrl}competitions/${leagueId}/teams`;
const standingEndPoin = `${baseUrl}competitions/${leagueId}/standings`;
const matchEndPoin = `${baseUrl}competitions/${leagueId}/matches`;

var ViewModal = document.querySelector('.modal');
//var instances = M.Modal.init(elems);

const contents = document.querySelector("#content-list");
const title = document.querySelector(".card-title");

const fetchHeader = {
    headers: {
        'X-Auth-Token': ApiKey
    }
};


function getListTeams() {
    title.innerHTML = "Daftar Tim Liga Primer Inggris"
    fetch(teamEndPoin, fetchHeader)
        .then(response => response.json())
        .then(resJson => {
            console.log(resJson.teams);
            let teams = "";
            resJson.teams.forEach(team => {
                teams += `
                <li class="collection-item avatar">
                    <img src="${team.crestUrl}" alt="" class="circle">
                    <span class="title">${team.name}</span>
                    <p>Berdiri: ${team.founded} <br>
                       Markas: ${team.venue}
                    </p>
                    <a href="#modal1" data-id="${team.id}" class="secondary-content modal-trigger"><i class="material-icons" data-id="${team.id}">info</i></a>
                   </li>
                     `
            });
            contents.innerHTML = '<ul class="collection">' + teams + '</ul>'
                const detil = document.querySelectorAll('.secondary-content');
                detil.forEach(btn => {
                    btn.onclick = (event) => {
                        getInfoTeams(baseUrl + "teams/" + event.target.dataset.id);
                }
            })
        }).catch(err => {
            console.error(err);
        })
}
function getInfoTeams(id){
    fetch(id,fetchHeader)
    .then(response => response.json())
        .then(resJson => {
                ViewModal.innerHTML=`
                <div class="col s12 m7">
                <h4 class="header">Informasi Detail</h4>
                <div class="card horizontal">
                     <div class="card-image align "center">
                     <img class="responsive-img"  src="${resJson.crestUrl}">
                     </div>
                        <div class="card-stacked">
                        <div class="card-content">
                            <h5>${resJson.name}</h5>
                                <p>
                                    Id          : ${resJson.id} <br> 
                                    Short name  : ${resJson.shortName} <br>                                    
                                    Berdiri     : ${resJson.founded} <br>
                                    Markas      : ${resJson.venue} <br>
                                    Phone       : ${resJson.phone} <br>                                    
                                    E-mail      : ${resJson.email} <br>
                                    Website     : ${resJson.website} <br>
                                    Address     : ${resJson.address} 
                                </p>
                        </div>
                        
                        <div class="modal-footer">
                        <a href="#!" class="modal-close waves-effect waves-green btn-flat">Agree</a>
                        </div> ` ;
        }).catch(err => {
            console.error(err);
    })
}

function getListStandings() {
    title.innerHTML = "Klasemen Sementara Liga Primer Inggris";
    fetch(standingEndPoin, fetchHeader)
        .then(response => response.json())
        .then(resJson => {
            console.log(resJson.standings[0]);
            let teams = "";
            let i = 1;
            resJson.standings[0].table.forEach(team => {
                teams += `
                <tr>
                    <td style="padding-left:20px;">${i}.</td>
                    <td><img src="${team.team.crestUrl}" alt="${team.team.name}" width="30px"></td>
                    <td>${team.team.name}</td>
                    <td>${team.playedGames}</td>
                    <td>${team.won}</td>
                    <td>${team.draw}</td>
                    <td>${team.lost}</td>
                    <td>${team.points}</td>
                </tr>
                `;
                i++;
            });
            contents.innerHTML = `
                <div class="card">
                    <table class="stripped responsive-table">
                        <thead>
                            <th></th>
                            <th></th>
                            <th>Nama Tim</th>
                            <th>PG</th>
                            <th>W</th>
                            <th>D</th>
                            <th>L</th>
                            <th>P</th>
                        </thead>
                        <tbody>
                            ${teams}
                        </tbody>
                    </table>
                </div>
            `;
        }).catch(err => {
            console.error(err);
        })
}

function getListMatches() {
    title.innerHTML = "Jadwal Pertandingan Liga Primer Inggris";
    fetch(matchEndPoin, fetchHeader)
        .then(response => response.json())
        .then(resJson => {
            console.log(resJson.matches);
            let matchs = "";
            let i = 1;
            resJson.matches.forEach(match => {
                let d = new Date(match.utcDate).toLocaleDateString("id");
                let scoreHomeTeam = (match.score.fullTime.homeTeam == null ? 0 : match.score.fullTime.homeTeam);
                let scoreAwayTeam = (match.score.fullTime.awayTeam == null ? 0 : match.score.fullTime.awayTeam);
                matchs += `
                <tr>
                    <td style="padding-left:20px;">${i}.</td>
                    <td>${match.homeTeam.name} vs ${match.awayTeam.name}</td>
                    <td>${d}</td>
                    <td>${scoreHomeTeam}:${scoreAwayTeam}</td>
                </tr>
                `;
                i++;

            });
            contents.innerHTML = `
                <div class="card">
                    <table class="stripped responsive-table">
                        <thead>
                            <th></th>
                            <th>Peserta</th>
                            <th>Tanggal</th>
                            <th>Skor Akhir</th>
                        </thead>
                        <tbody>
                            ${matchs}
                        </tbody>
                    </table>
                </div>
            `;
        }).catch(err => {
            console.error(err);
        })
}

function loadPage(page) {
    switch (page) {
        case "teams":
            getListTeams();
            break;
        case "standings":
            getListStandings();
            break;
        case "matches":
            getListMatches();
            break;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);

    document.querySelectorAll(".sidenav a, .topnav a").forEach(elm => {
        elm.addEventListener("click", evt => {
            let sideNav = document.querySelector(".sidenav");
            M.Sidenav.getInstance(sideNav).close();
            page = evt.target.getAttribute("href").substr(1);
            loadPage(page);
        })
    })
    var page = window.location.hash.substr(1);
    if (page === "" || page === "!") page = "teams";
    var modal = document.querySelectorAll('.modal');
    M.Modal.init(modal);
    loadPage(page);
});