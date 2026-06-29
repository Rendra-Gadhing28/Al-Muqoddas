import { useState, useEffect} from "react";

const URL = "https://script.google.com/macros/s/AKfycbzDTwHtb-5XgxVREcVxubEZFsQk_cmqpaFQOl_X58P-Ld1fI09uLxWweiRcjSgGosJ6dw/exec"

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