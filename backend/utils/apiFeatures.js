class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  search() {
    let keyword = {};
    // console.log(keyword);
    if(!this.queryStr) {
      
    }
    if(this.queryStr.name){
          keyword = {
            ...keyword,
            name: {
              $regex: this.queryStr.name,
              $options: "i", // makes it case insensitive
            },
          };
    }
    if(this.queryStr.author){
            keyword = {
              ...keyword,
              author: {
                $regex: this.queryStr.author,
                $options: "i", // makes it case insensitive
              },
            };
    }
    if(this.queryStr.number){
          keyword = {
            ...keyword,
            number: this.queryStr.number,
          };
    }
    if(this.queryStr.phone){
      keyword = {
        ...keyword,
        phone: this.queryStr.phone,
      };
    }
    if(this.queryStr.category){
      keyword = {
        ...keyword,
        category: {
          $regex: this.queryStr.category,
          $options: "i",
        }
      };
    }
    if(this.queryStr.degree){
      keyword = {
        ...keyword,
        degree: this.queryStr.degree.toUpperCase(),
      };
    }
    if(this.queryStr.qualification){
      keyword = {
        ...keyword,
        qualification: this.queryStr.qualification.toLowerCase(),
      };
    }
    if(this.queryStr.designation){
      keyword = {
        ...keyword,
        designation: this.queryStr.designation.toUpperCase(),
      };
    }
    if(this.queryStr.subject){
      keyword = {
        ...keyword,
        subject: this.queryStr.subject.toUpperCase(),
      };
    }
    if(this.queryStr.stream){
      keyword = {
        ...keyword,
        stream: {
          $regex: this.queryStr.stream,
          $options: "i",
        }
      };
    }
    if(this.queryStr.semester){
      keyword = {
        ...keyword,
        semester: this.queryStr.semester,
      };
    }
    if(this.queryStr.rollNo){
      keyword = {
        ...keyword,
        rollNo: {
          $regex: this.queryStr.rollNo,
          $options: "i",
        }
      };
    }
    if(this.queryStr.hostel){
      this.queryStr.hostel = this.queryStr.hostel.toUpperCase();
      keyword = {
        ...keyword,
        hostel: this.queryStr.hostel === "YES" ? true : false,
      };
    }
    if(this.queryStr.grade){
      keyword = {
        ...keyword,
        grade: this.queryStr.grade,
      };
    }
    this.query = this.query.find({ ...keyword });
    return this;
  }
}

module.exports = ApiFeatures;
