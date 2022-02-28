exports.notification = {
  new_account: `Welcome to Chef Koochooloo`,
  new_class: "You have created a new class '${this.className}'",
  assignment_completed_student: "You have completed ${this.assignmentTitle} assignment.",
  new_assignment: "New assignment has been assigned to you with name '${this.assignmentName}'",
  show_contact_information_to_student:"Contact Information are school:'${this.name}',contact person email:'${this.contactPersonEmail}',contact person number:'${this.contactPersonNumber}'",
  student_performance_alert: "${this.entity} has completed assignment '${this.assignmentTitle}' with level '${this.levelName}'",
  new_assignment: "New assignment has been assigned to you with name '${this.assignmentName}'",
  assignment_completed: "${this.entity} completed ${this.assignmentTitle} assignment.",
  student_take_action_activity:
    "Student ${this.firstName} ${this.lastName} has taken ${this.assignmentTitle} assignment's action activity",
  added_to_class: "You have been added to '${this.className}' class",
};
