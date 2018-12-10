export default class DataExtension {

  constructor() {
    this.Id = '';
    this.Name = '';
    this.Key = '';
    this.Description = '';
    this.IsSendable = false;
    this.IsTestable = false;

    this.Columns = [{
      Name : '',
      FieldType : 'TEXT',
      MaxLength : 50,
      IsPrimaryKey : false,
      IsRequired : false,
      DefaultValue : ''
    }];
  }
}