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
    else if(this.queryStr.name){
          keyword = {
            name: {
              $regex: this.queryStr.name,
              $options: "i", // makes it case insensitive
            },
          };
    }
    else if(this.queryStr.author){
            keyword = {
              author: {
                $regex: this.queryStr.author,
                $options: "i", // makes it case insensitive
              },
            };
    }
    else if(this.queryStr.number){
          keyword = {
            number: this.queryStr.number,
          };
    }
    else if(this.queryStr.phone){
      keyword = {
        phone: this.queryStr.phone,
      };
    }
    else if(this.queryStr.category){
      keyword = {
        category: {
          $regex: this.queryStr.category,
          $options: "i",
        }
      };
    }
    else if(this.queryStr.degree){
      keyword = {
        degree: this.queryStr.degree.toUpperCase(),
      };
    }
    else if(this.queryStr.qualification){
      keyword = {
        qualification: this.queryStr.qualification.toLowerCase(),
      };
    }
    else if(this.queryStr.designation){
      keyword = {
        designation: this.queryStr.designation.toUpperCase(),
      };
    }
    else if(this.queryStr.subject){
      keyword = {
        subject: this.queryStr.subject.toUpperCase(),
      };
    }
    else if(this.queryStr.stream){
      keyword = {
        stream: {
          $regex: this.queryStr.stream,
          $options: "i",
        }
      };
    }
    else if(this.queryStr.semester){
      keyword = {
        semester: this.queryStr.semester,
      };
    }
    else if(this.queryStr.rollNo){
      keyword = {
        rollNo: this.queryStr.rollNo,
      };
    }
    else if(this.queryStr.hostel){
      this.queryStr.hostel = this.queryStr.hostel.toUpperCase();
      keyword = {
        hostel: this.queryStr.hostel === "YES" ? true : false,
      };
    }
    else if(this.queryStr.grade){
      keyword = {
        grade: this.queryStr.grade,
      };
    }
    this.query = this.query.find({ ...keyword });
    return this;
  }
}

module.exports = ApiFeatures;
