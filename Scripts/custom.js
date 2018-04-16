var database_link = "https://hsaygan.github.io/Chords-Station/database.json";

function get_song_link_from_dictionary(song_name, artist_name)
{
    //Get Dictionary of all the Songs
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function()
    {
        if (this.readyState == 4 && this.status == 200) {console.log(xhttp.responseText)}
    };
    xhttp.open("GET", database_link, true);
    xhttp.send();
    let database = xhttp.responseText;

    //Return File Link
    console.log("\nGot the Database!");
    console.log(JSON.stringify(database));
    for (var file_manifest in database)
    {

        console.log("\nSong: " + file_manifest.song + " by " + file_manifest.artist);
        if (artist_name = file_manifest.artist)
        {
            if (song_name == file_manifest.song)
            {
                console.log(file_manifest);
                return file_manifest;
            }
        }
        console.log("\n\t Found Match!");
    }
    return -1;
}

function run_this_random(song_name, artist)
{
    //Get Song File
    file_manifest = get_song_link_from_dictionary(song_name, artist);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function()
    {
        if (this.readyState == 4 && this.status == 200){}
    };
    xhttp.open("GET", file_manifest.link, true);
    xhttp.send();
    let file_object = xhttp.responseText;

    //Initializations
    document.getElementById("youtube_video").src = file_manifest.youtube_link;
    var timer = new Timer();
    timer.start();

    //Display Timer
    timer.addEventListener('secondsUpdated', function (e) {
        document.getElementById("timer").innerHTML = timer.getTimeValues().toString();
    });

    /*//Testing
    var all_lines = file_object.split("\n");
    for (var current_line in all_lines)
    {
        current_line = current_line.toString().split(":");
        var hours = parseInt(current_line[0]);
        var minutes = parseInt(current_line[1]);
        var seconds = parseInt(current_line[2]);
        var chord = current_line[3];

        if (hours == timer.getTimeValues().hours)
        {
            if (hours == timer.getTimeValues().minutes)
            {
                if (hours == timer.getTimeValues().seconds)
                {
                    document.getElementById("display_chord").innerHTML = chord;
                }
            }
        }
    }*/
}

run_this_random("Dilnawaaz", "Local Train")
