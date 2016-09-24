module.exports = function() {
    var self = this;

    // Start
    self.startStr = "";

    // End (Mirrored)
    self.endStr = "";

    // <element>
    // class="myClass"
    // Returns: void
    self.addHolder = function(element, myClass) {

        self.endStr = [
                '</' + element + '>',
            ].join('') + self.endStr;

        self.startStr += [
            '<' + element + addClass(myClass) + '>',
        ].join('');
        return true;
    };

    // Adds row without mirror
    // <element>
    // class="myClass"
    // Returns: true
    self.addRow = function(element, string) {
        self.startStr += [
            '<' + element + '>',
            string,
            '</' + element + '>'].join('');
        return true;
    };

    // Returns: String
    self.toString = function() {
        return self.startStr + self.endStr;
    };

    // Private method
    // Checks if class, and adds it
    // Returns: String
    var addClass = function(myClass) {
        if (myClass) {
            return ' class="' + myClass + '"';
        }
        return '';
    }
};
