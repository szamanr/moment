import React, {useEffect, useState} from "react";

export const useLayout = (db, momentId) => {
    const [layout, setLayout] = useState([]);

    useEffect(() => {
        (async () => {
            const moment = await db.collection('moments')
                .doc(momentId)
                .get();

            setLayout(await moment.get('layout'));
        })();
    }, [db, momentId]);

    return layout;
};

export default useLayout;
