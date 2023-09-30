class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  search() {
    let keyword = {};
    // console.log(keyword);
    if(this.queryStr.name){
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
              $options: "i", // makes it case insensitive
            },
          };
    }
    this.query = this.query.find({ ...keyword });
    return this;
  }
}

module.exports = ApiFeatures;
