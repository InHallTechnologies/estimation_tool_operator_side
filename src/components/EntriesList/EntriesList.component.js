import { off, onValue, ref } from "firebase/database";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { firebaseAuth, firebaseDatabase } from "../../backend/firebaseHandler";
import SearchContext from "../../context/search-context";
import EntriesArch from "../EntriesArch/EntriesArch.component";
import './EntriesList.styles.scss';

const EntriesList = () => {
    const [list, setList] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const firebaseUser = firebaseAuth.currentUser; 
    const [searchQuery, setSearchQuery] = useContext(SearchContext);

    useEffect(() => {
        const entriesRef = ref(firebaseDatabase, `OPERATOR_WISE_ENTRIES_ARCHIVE/${firebaseUser.uid}`);
        onValue(entriesRef, snapshot => {
            if (snapshot.exists()) {
                const data = [];
                for (const key in snapshot.val()) {
                    const entry = snapshot.child(key).val();
                    if (JSON.stringify(entry).toLowerCase().includes(searchQuery.toLowerCase())) {
                        if (searchParams.get("filter") === "all" || !searchParams.get('filter')) {
                            data.push(entry);
                            setSearchParams({filter:'all'})
                        }else
                        if (searchParams.get("filter") === "today") {
                            if (entry.date === moment().format("Do MMMM YYYY")) {
                                data.push(entry);
                            }
                        }
                        else
                        if (searchParams.get("filter") === "this-month") {
                            const entryMonth = entry.date.split(" ")[1];
                            const currentMonth = moment().format("Do MMMM YYYY").split(" ")[1];
                           
                            if (entryMonth === currentMonth) {
                                data.push(entry);
                            }
                        }
                       
                    }
                   
                }
                data.reverse();
                setList(data);
            }
        }, { onlyOnce: false })

        return () => {
            off(entriesRef, "value")
        }
    }, [searchParams, searchQuery])

    return (
        <div className="entries-list-container">
            {
                list.map(item => <EntriesArch key={item.key} item={item} />)
            }
        </div>
    )
}

export default EntriesList;