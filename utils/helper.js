const nodemailer = require('nodemailer');
const ObjectId = require('mongoose').Types.ObjectId;

const {baseUrl, recordsPerPage, mailHost, mailPort, mailUsername, mailPassword} = require('../utils/constants');

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
        host: mailHost,
        port: mailPort,
        auth: {
            user: mailUsername,
            pass: mailPassword
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

