var dictionary_link = "https://raw.githubusercontent.com/hsaygan/Chords-Station/master/database.json";

function get_song_link_from_dictionary(song_name, artist_name)
{
    //Get Dictionary of all the Songs
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function()
    {
        if (this.readyState == 4 && this.status == 200){}
    };
    xhttp.open("GET", dictionary_link, true);
    xhttp.send();

    //Return File Link
    let database = xhttp.responseText;
    for (var file_manifest in database)
    {
        console.log("\nSong: " + file_manifest.song + " by " + file_manifest.artist);
        if (artist_name = file_manifest.artist)
        {
            if (song_name == file_manifest.song)
            {
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

    //Initializations
    let file_object = xhttp.responseText;
    document.getElementById("youtube_video").src = file_manifest.youtube_link;
    var timer = new Timer();
    timer.start();

    timer.addEventListener('secondsUpdated', function (e) {
        document.getElementById("timer").innerHTML = timer.getTimeValues().toString();
    });
    //Separate Chords and Time
    /*x = file_object.read_next_line();
    time_for_next_chord = x.get_time();
    chord = x.get_chord();
    while (1)
    {
        if (current_time = time_for_next_chord)
        {
            document.getElementById("display_chord").innerHTML = chord;
        }
    }*/
}

run_this_random("Dilnawaaz", "Local Train")
