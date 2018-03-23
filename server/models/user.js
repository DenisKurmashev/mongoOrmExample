module.exports = (name, age, country, phone, type) => ({
    id: (new Date()).getTime().toString(),
    name,
    age,
    country,
    phone,
    type,    
});