// SPDX-License-Identifier: MIT


pragma solidity ^0.8.0;

contract Invoice {
    
    struct InvoiceData {
        uint256 invoiceNumber;
        address customerAddress;
        string customerName;
        string itemDescription;
        uint256 amountDue;
        bool isPaid;
    }
    
    mapping(uint256 => InvoiceData) public invoices;
    uint256 public invoiceCount = 0;
    
    function createInvoice(address _customerAddress, string memory _customerName, string memory _itemDescription, uint256 _amountDue) public {
        invoiceCount++;
        invoices[invoiceCount] = InvoiceData(invoiceCount, _customerAddress, _customerName, _itemDescription, _amountDue, false);
    }
    
    function updateInvoice(uint256 _invoiceNumber, address _customerAddress, string memory _customerName, string memory _itemDescription, uint256 _amountDue) public {
        invoices[_invoiceNumber] = InvoiceData(_invoiceNumber, _customerAddress, _customerName, _itemDescription, _amountDue, false);
    }
    
    function payInvoice(uint256 _invoiceNumber) public payable {
        require(invoices[_invoiceNumber].isPaid == false, "Invoice has already been paid");
        require(msg.value == invoices[_invoiceNumber].amountDue, "Incorrect amount sent");
        invoices[_invoiceNumber].isPaid = true;
    }
    
    function getInvoiceDetails(uint256 _invoiceNumber) public view returns (InvoiceData memory) {
        return invoices[_invoiceNumber];
    }
}
