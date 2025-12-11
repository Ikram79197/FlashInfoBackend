package com.flashinfo.repository;

import com.flashinfo.entity.CaNonVieMensuel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CaNonVieMensuelRepository extends JpaRepository<CaNonVieMensuel, Long> {
}
