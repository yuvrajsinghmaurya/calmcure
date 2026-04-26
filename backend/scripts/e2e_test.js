(async () => {
    const base = 'http://localhost:8000/api';
    const unique = Date.now();
    const name = 'Test User';
    const email = `test+${unique}@example.com`;
    const password = 'P@ssw0rd!';

    function ok(label, res) {
        console.log(`[OK] ${label}`);
        return res;
    }
    function fail(label, err) {
        console.error(`[FAIL] ${label}`, err && err.message ? err.message : err);
        process.exit(1);
    }

    try {
        console.log('Registering user:', email);
        let r = await fetch(`${base}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const reg = await r.json();
        if (!reg.success) return fail('register', reg);
        ok('register', reg);

        console.log('Logging in');
        r = await fetch(`${base}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const login = await r.json();
        if (!login.success) return fail('login', login);
        ok('login', login);
        const token = login.token;

        console.log('Create mood');
        r = await fetch(`${base}/moods`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify({ mood: 'Happy', intensity: 4, note: 'Testing mood' })
        });
        const createdMood = await r.json();
        if (!createdMood.success) return fail('create mood', createdMood);
        ok('create mood', createdMood);
        const moodId = createdMood.mood.id;

        console.log('Fetch moods');
        r = await fetch(`${base}/moods`, { headers: { 'Authorization': 'Bearer ' + token } });
        const moods = await r.json();
        if (!moods.success) return fail('get moods', moods);
        ok('get moods', moods);

        console.log('Create journal');
        r = await fetch(`${base}/journals`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify({ content: 'Test journal', mood: 'Calm' })
        });
        const createdJournal = await r.json();
        if (!createdJournal.success) return fail('create journal', createdJournal);
        ok('create journal', createdJournal);
        const journalId = createdJournal.journal.id;

        console.log('Fetch journals');
        r = await fetch(`${base}/journals`, { headers: { 'Authorization': 'Bearer ' + token } });
        const journals = await r.json();
        if (!journals.success) return fail('get journals', journals);
        ok('get journals', journals);

        console.log('Delete mood');
        r = await fetch(`${base}/moods/${moodId}`, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + token } });
        const delMood = await r.json();
        if (!delMood.success) return fail('delete mood', delMood);
        ok('delete mood', delMood);

        console.log('Delete journal');
        r = await fetch(`${base}/journals/${journalId}`, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + token } });
        const delJournal = await r.json();
        if (!delJournal.success) return fail('delete journal', delJournal);
        ok('delete journal', delJournal);

        console.log('\nE2E tests completed successfully');
        process.exit(0);
    } catch (err) {
        console.error('E2E test error', err);
        process.exit(1);
    }
})();
