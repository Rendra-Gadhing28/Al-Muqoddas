import { useState, useEffect} from "react";

const URL = "https://script.google.com/macros/s/AKfycbztcf_COgD4LJlPi6ixSasfBFtAScGkYgZmhqiCkMUX2xiFZsBgbofXaY7_R9ue4cAg/exec"

export function useAnggota(){
    const [anggota, setAnggota] = useState([])
    const [loading, setLoading] = useState(true)
    const [err, setErr] = useState(null)


    useEffect(() => {
        fetch(URL)
        .then((res) => res.json())
        .then((json) => {
            if (json.succes) setAnggota(json.data)
        })
        .catch((err) => setErr(err.message))
        .finally(() => setLoading(false))
    }, []);
   
    return {
        anggota,
        loading,
        err
    }
}