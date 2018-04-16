function post_raw_data()
{

}

function get_song_file(song_name, artist)
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function()
    {
        if (this.readyState == 4 && this.status == 200)
        {
           document.getElementById("file-content").value = xhttp.responseText;
        }
    };
    xhttp.open("GET", "https://raw.githubusercontent.com/hsaygan/Chords-Station/master/Chords/Local%20Train/Aaftaab.chords", true);
    xhttp.send();
}

function run_this_random(song_name, artist)
{
    file_contents = get_song_file(song_name, artist);
    x = file_contents.read_next_line();
    time_for_next_chord = x.get_time();
    chord = x.get_chord();
    while (1)
    {
        if (current_time = time_for_next_chord)
        {
            textare.value = chord;
        }
    }
}
