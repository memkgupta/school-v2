import React, { useEffect, useState } from 'react'
import { ColorRing } from 'react-loader-spinner';
import FeeStructures from '../components/FeeStructures';
import FeePayments from '../components/FeePayments';
import AddFeeStructureModal from '../components/Modals/AddFeeStructureModal';
import { useDispatch } from 'react-redux';
import { loadClassThunk } from '../slices/classSlice';
import { useToken } from '../hooks/useCookie';
import EditFeeStructure from '../components/Modals/EditFeeStructure';
import { Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

function Fee() {
    const [isLoading,setIsLoading] = useState(true);
    const [addStructure,setAddStructure] = useState(false);
    const [editFeeStructure,setEditFeeStructure] = useState(false);
    const [selectedFeeStructure,setSelectedFeeStructure] = useState(null);
   const dispatch = useDispatch();
    const openAddDialogue = ()=>{
setAddStructure(true);
   }
   const closeAddStructureModal = ()=>{
    setAddStructure(false);
   }
   const showEditModal = (fee_structure)=>{
    setSelectedFeeStructure(fee_structure);
    setEditFeeStructure(true);
    
   }
   const closeEditModal = ()=>{
    setEditFeeStructure(false);
   }
    useEffect(()=>{
       dispatch(loadClassThunk(useToken()));
    },[]);
  return (
    <>
    <Toaster></Toaster>
<div className="flex justify-center mt-5">
  <Link to={'/fee/pay'} className='bg-red-500 p-3 text-white'>Pay Fee</Link>
</div>
<div className={`${addStructure?'':'hidden'}`}>
  <AddFeeStructureModal closeModal={closeAddStructureModal}></AddFeeStructureModal>
</div>
<div className={`${editFeeStructure?'':'hidden'}`}>
  <EditFeeStructure structure={selectedFeeStructure} closeModal={closeEditModal}></EditFeeStructure>
</div>
<FeeStructures showEditModal={showEditModal} openAddDialogue={openAddDialogue}></FeeStructures>
<FeePayments></FeePayments>
    </>
  )
}

export default Fee