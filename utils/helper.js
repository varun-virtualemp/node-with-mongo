const nodemailer = require('nodemailer');
const ObjectId = require('mongoose').Types.ObjectId;

const baseUrl = process.env.BASE_URL;
const recordsPerPage = process.env.RECORDS_PER_PAGE;

exports.pagination = (currentPage, totalItems, moduleName) => {
    let prevPage = (currentPage !== 1 ? (currentPage - 1) : '');
    let nextPage = currentPage + 1;
    let lastPage = Math.ceil(totalItems / recordsPerPage);
    return paginationData = {
        "current_page"  : currentPage,
        "last_page"     : lastPage,
        "last_page_url" : baseUrl + moduleName + '?page=' + lastPage,
        "next_page_url" : ((lastPage >= nextPage) ? baseUrl + moduleName + '?page=' + nextPage : ''),
        "per_page"      : recordsPerPage,
        "prev_page_url" : prevPage ? baseUrl + moduleName + '?page=' + prevPage : '',
        "total"         : totalItems
    }
}

exports.sendEmail = async(from, to, subject, body) => {
    // create transporter object with smtp server details
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
    });

    // send email
    await transporter.sendMail({
        from: 'from_address@example.com',
        to: "varuntesting59@gmail.com, varunvirtual@yopmail.com",
        subject: 'Test Email Subject',
        html: '<h1>Example HTML Message Body</h1>'
    });
}

exports.isObjectIdValid = id => ObjectId.isValid(id) ? String(new ObjectId(id) === id) ? true : false : false;

