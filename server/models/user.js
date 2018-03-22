module.exports = (name, age, country, phone, type) => ({
    name,
    age,
    country,
    phone,
    type,
    date: (new Date()).getTime()
});